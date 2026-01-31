"use client";

import { useRef, useState, useCallback } from "react";
import { MultiViewForm } from "@/components/multi-view-form/MultiViewForm";
import { FormSidebar } from "@/components/multi-view-form/FormSidebar";
import { FormData, formViews } from "@/lib/schemas/formSchema";
import { MultiViewFormHandle, FormState, FormRegistration } from "@/components/multi-view-form/types";

const initialFormState: FormState = {
  activeView: "personal",
  visitedViews: ["personal"],
  errorCounts: { personal: 0, contact: 0, preferences: 0 },
};

export default function FormPage() {
  // Refs for each form - sidebar uses these to call setActiveView
  const form1Ref = useRef<MultiViewFormHandle>(null);
  const form2Ref = useRef<MultiViewFormHandle>(null);

  // Track which form is currently active/visible
  const [activeFormId, setActiveFormId] = useState("user-profile");

  // Track state for each form (for sidebar display)
  const [form1State, setForm1State] = useState<FormState>(initialFormState);
  const [form2State, setForm2State] = useState<FormState>(initialFormState);

  // Form registrations for sidebar
  const forms: FormRegistration[] = [
    {
      id: "user-profile",
      label: "User Profile",
      ref: form1Ref,
      views: formViews,
      state: form1State,
    },
    {
      id: "company-info",
      label: "Company Info",
      ref: form2Ref,
      views: formViews,
      state: form2State,
    },
  ];

  const handleForm1Submit = useCallback((data: FormData) => {
    console.log("User Profile submitted:", data);
    alert("User Profile submitted!\n\n" + JSON.stringify(data, null, 2));
  }, []);

  const handleForm2Submit = useCallback((data: FormData) => {
    console.log("Company Info submitted:", data);
    alert("Company Info submitted!\n\n" + JSON.stringify(data, null, 2));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Multi-Form Page
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Multiple forms with shared sidebar navigation using useImperativeHandle
        </p>
      </header>

      <main className="flex h-[calc(100vh-89px)]">
        <FormSidebar
          forms={forms}
          activeFormId={activeFormId}
          onFormSelect={setActiveFormId}
        />

        <div className="flex-1 relative">
          {/* Form 1 - User Profile */}
          <div className={activeFormId === "user-profile" ? "block h-full" : "hidden"}>
            <MultiViewForm
              ref={form1Ref}
              onSubmit={handleForm1Submit}
              onStateChange={setForm1State}
            />
          </div>

          {/* Form 2 - Company Info */}
          <div className={activeFormId === "company-info" ? "block h-full" : "hidden"}>
            <MultiViewForm
              ref={form2Ref}
              onSubmit={handleForm2Submit}
              onStateChange={setForm2State}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
