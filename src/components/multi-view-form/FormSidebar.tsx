"use client";

import { useFormContext } from "react-hook-form";
import { useFormView } from "@/contexts/FormViewContext";
import { formViews, FormData } from "@/lib/schemas/formSchema";
import { FormNavItem } from "./FormNavItem";

export function FormSidebar() {
  const { activeView, setActiveView, visitedViews } = useFormView();
  const {
    formState: { errors },
  } = useFormContext<FormData>();

  // Count errors per view by checking which fields belong to each view
  const getErrorCountForView = (fields: readonly string[]): number => {
    return fields.filter((field) => field in errors).length;
  };

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Form Sections
      </h2>
      <nav className="space-y-1">
        {formViews.map((view) => (
          <FormNavItem
            key={view.id}
            viewId={view.id}
            label={view.label}
            isActive={activeView === view.id}
            isVisited={visitedViews.has(view.id)}
            errorCount={getErrorCountForView(view.fields)}
            onClick={() => setActiveView(view.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
