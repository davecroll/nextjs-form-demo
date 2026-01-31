"use client";

import { useRef, useState, useCallback } from "react";
import { UserProfileForm } from "@/components/user-profile-form/UserProfileForm";
import { CompanyInfoForm } from "@/components/company-form/CompanyInfoForm";
import { FormSidebar } from "@/components/form-shared/FormSidebar";
import { Button } from "@/components/ui/Button";
import { FormData, formViews } from "@/lib/schemas/formSchema";
import { CompanyFormData, companyViews } from "@/lib/schemas/companySchema";
import { MultiViewFormHandle, FormState, FormRegistration } from "@/components/form-shared/types";

const initialUserFormState: FormState = {
  activeView: "personal",
  validatedViews: [],
  errorCounts: { personal: 0, contact: 0, preferences: 0 },
};

const initialCompanyFormState: FormState = {
  activeView: "basics",
  validatedViews: [],
  errorCounts: { basics: 0, details: 0 },
};

export default function FormPage() {
  // Refs for each form - sidebar uses these to call setActiveView
  const userFormRef = useRef<MultiViewFormHandle<FormData>>(null);
  const companyFormRef = useRef<MultiViewFormHandle<CompanyFormData>>(null);

  // Track which form is currently active/visible
  const [activeFormId, setActiveFormId] = useState("user-profile");

  // Track state for each form (for sidebar display)
  const [userFormState, setUserFormState] = useState<FormState>(initialUserFormState);
  const [companyFormState, setCompanyFormState] = useState<FormState>(initialCompanyFormState);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form registrations for sidebar
  const forms: FormRegistration[] = [
    {
      id: "user-profile",
      label: "User Profile",
      ref: userFormRef,
      views: formViews,
      state: userFormState,
    },
    {
      id: "company-info",
      label: "Company Info",
      ref: companyFormRef,
      views: companyViews,
      state: companyFormState,
    },
  ];

  // Unified submit handler - validates and collects data from all forms
  const handleUnifiedSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Validate all forms in parallel
      const [userValid, companyValid] = await Promise.all([
        userFormRef.current?.validate() ?? false,
        companyFormRef.current?.validate() ?? false,
      ]);

      if (!userValid || !companyValid) {
        // Find first form with errors and switch to it
        if (!userValid) {
          setActiveFormId("user-profile");
        } else if (!companyValid) {
          setActiveFormId("company-info");
        }
        return;
      }

      // Collect data from all forms
      const userData = userFormRef.current?.getValues();
      const companyData = companyFormRef.current?.getValues();

      const combinedData = {
        user: userData,
        company: companyData,
      };

      console.log("All forms submitted:", combinedData);
      alert("All forms submitted successfully!\n\n" + JSON.stringify(combinedData, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Registration
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Complete both forms to finish registration
        </p>
      </header>

      <main className="flex h-[calc(100vh-89px)]">
        <FormSidebar
          forms={forms}
          activeFormId={activeFormId}
          onFormSelect={setActiveFormId}
        />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            {/* User Profile Form */}
            <div className={activeFormId === "user-profile" ? "block h-full" : "hidden"}>
              <UserProfileForm
                ref={userFormRef}
                onStateChange={setUserFormState}
                managed
              />
            </div>

            {/* Company Info Form */}
            <div className={activeFormId === "company-info" ? "block h-full" : "hidden"}>
              <CompanyInfoForm
                ref={companyFormRef}
                onStateChange={setCompanyFormState}
                managed
              />
            </div>
          </div>

          {/* Unified submit button */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleUnifiedSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit All"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
