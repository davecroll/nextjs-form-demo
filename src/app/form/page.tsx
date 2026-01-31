"use client";

import { MultiViewFormProvider } from "@/components/multi-view-form/MultiViewFormProvider";
import { FormSidebar } from "@/components/multi-view-form/FormSidebar";
import { FormViewContainer } from "@/components/multi-view-form/FormViewContainer";
import { FormData } from "@/lib/schemas/formSchema";

export default function FormPage() {
  const handleSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully!\n\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Multi-View Form
        </h1>
      </header>

      <main className="h-[calc(100vh-73px)]">
        <MultiViewFormProvider onSubmit={handleSubmit}>
          <FormSidebar />
          <FormViewContainer />
        </MultiViewFormProvider>
      </main>
    </div>
  );
}
