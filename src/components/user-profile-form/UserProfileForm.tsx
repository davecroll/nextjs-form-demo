"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import type {
  FormState,
  MultiViewFormHandle,
} from "@/components/form-shared/types";
import { Button } from "@/components/ui/Button";
import {
  defaultFormValues,
  type FormData,
  formSchema,
  formViews,
  type ViewId,
} from "@/lib/schemas/formSchema";
import { ContactDetailsView } from "./views/ContactDetailsView";
import { PersonalInfoView } from "./views/PersonalInfoView";
import { PreferencesView } from "./views/PreferencesView";

const viewComponents = {
  personal: PersonalInfoView,
  contact: ContactDetailsView,
  preferences: PreferencesView,
} as const;

interface UserProfileFormProps {
  onSubmit?: (data: FormData) => void;
  onStateChange?: (state: FormState) => void;
  initialView?: ViewId;
  /** When true, hides internal navigation buttons (for external control) */
  managed?: boolean;
}

export const UserProfileForm = forwardRef<
  MultiViewFormHandle<FormData>,
  UserProfileFormProps
>(function UserProfileForm(
  { onSubmit, onStateChange, initialView = "personal", managed = false },
  ref,
) {
  const [activeView, setActiveViewState] = useState<ViewId>(initialView);
  const [visitedViews, setVisitedViews] = useState<string[]>([]);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = methods;

  // Calculate error counts per view
  const getErrorCounts = useCallback((): Record<string, number> => {
    const counts: Record<string, number> = {};
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
  }, [activeView, visitedViews, onStateChange, getErrorCounts]);

  // Validate current view's fields before switching to a new view
  const setActiveView = useCallback(
    async (viewId: string) => {
      const validViewId = viewId as ViewId;

      // Only validate if actually switching to a different view
      if (validViewId === activeView) {
        return;
      }

      // Validate current view before leaving
      const currentView = formViews.find((v) => v.id === activeView);
      if (currentView) {
        await trigger(currentView.fields as unknown as (keyof FormData)[]);
        // Mark the view we're leaving as visited (validated)
        setVisitedViews((prev) =>
          prev.includes(activeView) ? prev : [...prev, activeView],
        );
      }

      setActiveViewState(validViewId);
    },
    [activeView, trigger],
  );

  const currentIndex = formViews.findIndex((v) => v.id === activeView);
  const isFirstView = currentIndex === 0;
  const isLastView = currentIndex === formViews.length - 1;

  const goToNextView = useCallback(async () => {
    if (currentIndex < formViews.length - 1) {
      await setActiveView(formViews[currentIndex + 1].id);
    }
  }, [currentIndex, setActiveView]);

  const goToPreviousView = useCallback(async () => {
    if (currentIndex > 0) {
      await setActiveView(formViews[currentIndex - 1].id);
    }
  }, [currentIndex, setActiveView]);

  // Validate the entire form and return whether it's valid
  const validate = useCallback(async (): Promise<boolean> => {
    const result = await trigger();
    // Mark all views as visited
    setVisitedViews(formViews.map((v) => v.id));
    return result;
  }, [trigger]);

  // Expose imperative methods via ref
  useImperativeHandle(
    ref,
    () => ({
      setActiveView,
      goToNextView,
      goToPreviousView,
      validate,
      getValues,
    }),
    [setActiveView, goToNextView, goToPreviousView, validate, getValues],
  );

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

        {!managed && (
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
        )}
      </form>
    </FormProvider>
  );
});
