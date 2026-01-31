"use client";

import {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useEffect,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  FormData,
  defaultFormValues,
  formViews,
  ViewId,
} from "@/lib/schemas/formSchema";
import { Button } from "@/components/ui/Button";
import { PersonalInfoView } from "./views/PersonalInfoView";
import { ContactDetailsView } from "./views/ContactDetailsView";
import { PreferencesView } from "./views/PreferencesView";
import { MultiViewFormHandle, FormState } from "./types";

const viewComponents = {
  personal: PersonalInfoView,
  contact: ContactDetailsView,
  preferences: PreferencesView,
} as const;

interface MultiViewFormProps {
  onSubmit?: (data: FormData) => void;
  onStateChange?: (state: FormState) => void;
  initialView?: ViewId;
}

export const MultiViewForm = forwardRef<MultiViewFormHandle, MultiViewFormProps>(
  function MultiViewForm({ onSubmit, onStateChange, initialView = "personal" }, ref) {
    const [activeView, setActiveViewState] = useState<ViewId>(initialView);
    const [visitedViews, setVisitedViews] = useState<ViewId[]>([initialView]);

    const methods = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: defaultFormValues,
      mode: "onBlur",
    });

    const {
      handleSubmit,
      formState: { errors, isSubmitting },
    } = methods;

    // Calculate error counts per view
    const getErrorCounts = useCallback((): Record<ViewId, number> => {
      const counts: Record<ViewId, number> = {
        personal: 0,
        contact: 0,
        preferences: 0,
      };

      for (const view of formViews) {
        counts[view.id] = view.fields.filter((field) => field in errors).length;
      }

      return counts;
    }, [errors]);

    // Notify parent of state changes
    useEffect(() => {
      onStateChange?.({
        activeView,
        visitedViews,
        errorCounts: getErrorCounts(),
      });
    }, [activeView, visitedViews, errors, onStateChange, getErrorCounts]);

    const setActiveView = useCallback((viewId: ViewId) => {
      setActiveViewState(viewId);
      setVisitedViews((prev) =>
        prev.includes(viewId) ? prev : [...prev, viewId]
      );
    }, []);

    const currentIndex = formViews.findIndex((v) => v.id === activeView);
    const isFirstView = currentIndex === 0;
    const isLastView = currentIndex === formViews.length - 1;

    const goToNextView = useCallback(() => {
      if (currentIndex < formViews.length - 1) {
        setActiveView(formViews[currentIndex + 1].id);
      }
    }, [currentIndex, setActiveView]);

    const goToPreviousView = useCallback(() => {
      if (currentIndex > 0) {
        setActiveView(formViews[currentIndex - 1].id);
      }
    }, [currentIndex, setActiveView]);

    // Expose imperative methods via ref
    useImperativeHandle(ref, () => ({
      setActiveView,
      goToNextView,
      goToPreviousView,
    }), [setActiveView, goToNextView, goToPreviousView]);

    const onFormSubmit = handleSubmit((data) => {
      onSubmit?.(data);
    });

    const ActiveViewComponent = viewComponents[activeView];

    return (
      <FormProvider {...methods}>
        <form onSubmit={onFormSubmit} className="flex-1 flex flex-col p-8">
          <div className="flex-1">
            <ActiveViewComponent />
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousView}
              disabled={isFirstView}
            >
              Previous
            </Button>

            {isLastView ? (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            ) : (
              <Button type="button" onClick={goToNextView}>
                Next
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    );
  }
);
