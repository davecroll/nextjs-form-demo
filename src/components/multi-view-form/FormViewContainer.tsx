"use client";

import { useFormContext } from "react-hook-form";
import { useFormView } from "@/contexts/FormViewContext";
import { FormData } from "@/lib/schemas/formSchema";
import { Button } from "@/components/ui/Button";
import { PersonalInfoView } from "./views/PersonalInfoView";
import { ContactDetailsView } from "./views/ContactDetailsView";
import { PreferencesView } from "./views/PreferencesView";

const viewComponents = {
  personal: PersonalInfoView,
  contact: ContactDetailsView,
  preferences: PreferencesView,
} as const;

export function FormViewContainer() {
  const { activeView, goToNextView, goToPreviousView, isFirstView, isLastView } =
    useFormView();
  const {
    formState: { isSubmitting },
  } = useFormContext<FormData>();

  const ActiveViewComponent = viewComponents[activeView];

  return (
    <div className="flex-1 flex flex-col p-8">
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
    </div>
  );
}
