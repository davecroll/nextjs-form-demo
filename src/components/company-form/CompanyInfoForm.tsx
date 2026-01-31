"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { FormState, MultiViewFormHandle } from "@/components/form-shared/types";
import { Button } from "@/components/ui/Button";
import {
  type CompanyFormData,
  type CompanyViewId,
  companySchema,
  companyViews,
  defaultCompanyValues,
} from "@/lib/schemas/companySchema";
import { CompanyBasicsView } from "./views/CompanyBasicsView";
import { CompanyDetailsView } from "./views/CompanyDetailsView";

const viewComponents = {
  basics: CompanyBasicsView,
  details: CompanyDetailsView,
} as const;

interface CompanyInfoFormProps {
  onSubmit?: (data: CompanyFormData) => void;
  onStateChange?: (state: FormState) => void;
  initialView?: CompanyViewId;
  /** When true, hides internal navigation buttons (for external control) */
  managed?: boolean;
}

export const CompanyInfoForm = forwardRef<MultiViewFormHandle<CompanyFormData>, CompanyInfoFormProps>(
  function CompanyInfoForm({ onSubmit, onStateChange, initialView = "basics", managed = false }, ref) {
    const [activeView, setActiveViewState] = useState<CompanyViewId>(initialView);
    const [visitedViews, setVisitedViews] = useState<string[]>([]);

    const methods = useForm<CompanyFormData>({
      resolver: zodResolver(companySchema),
      defaultValues: defaultCompanyValues,
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
      for (const view of companyViews) {
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

    // Simply switch to a new view (no validation - call validateCurrentView externally)
    const setActiveView = useCallback(
      (viewId: string) => {
        const validViewId = viewId as CompanyViewId;
        if (validViewId !== activeView) {
          setActiveViewState(validViewId);
        }
      },
      [activeView],
    );

    // Validate the current view and mark it as visited
    const validateCurrentView = useCallback(async (): Promise<boolean> => {
      const currentView = companyViews.find((v) => v.id === activeView);
      if (!currentView) return true;

      const result = await trigger(currentView.fields as unknown as (keyof CompanyFormData)[]);
      setVisitedViews((prev) => (prev.includes(activeView) ? prev : [...prev, activeView]));
      return result;
    }, [activeView, trigger]);

    const currentIndex = companyViews.findIndex((v) => v.id === activeView);
    const isFirstView = currentIndex === 0;
    const isLastView = currentIndex === companyViews.length - 1;

    const goToNextView = useCallback(async () => {
      if (currentIndex < companyViews.length - 1) {
        await validateCurrentView();
        setActiveView(companyViews[currentIndex + 1].id);
      }
    }, [currentIndex, validateCurrentView, setActiveView]);

    const goToPreviousView = useCallback(async () => {
      if (currentIndex > 0) {
        await validateCurrentView();
        setActiveView(companyViews[currentIndex - 1].id);
      }
    }, [currentIndex, validateCurrentView, setActiveView]);

    // Validate the entire form and return whether it's valid
    const validate = useCallback(async (): Promise<boolean> => {
      const result = await trigger();
      setVisitedViews(companyViews.map((v) => v.id));
      return result;
    }, [trigger]);

    const getActiveView = useCallback(() => activeView, [activeView]);

    // Expose imperative methods via ref
    useImperativeHandle(
      ref,
      () => ({
        setActiveView,
        goToNextView,
        goToPreviousView,
        validateCurrentView,
        validate,
        getValues,
        getActiveView,
      }),
      [setActiveView, goToNextView, goToPreviousView, validateCurrentView, validate, getValues, getActiveView],
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
              <Button type="button" variant="outline" onClick={goToPreviousView} disabled={isFirstView}>
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
  },
);
