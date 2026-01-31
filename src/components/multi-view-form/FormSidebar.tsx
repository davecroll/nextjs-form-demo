"use client";

import { FormRegistration } from "./types";
import { FormNavItem } from "./FormNavItem";

interface FormSidebarProps {
  forms: FormRegistration[];
  activeFormId: string;
  onFormSelect: (formId: string) => void;
}

export function FormSidebar({ forms, activeFormId, onFormSelect }: FormSidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
      {forms.map((form) => (
        <div key={form.id} className="mb-6">
          <button
            type="button"
            onClick={() => onFormSelect(form.id)}
            className={`
              w-full text-left text-sm font-semibold mb-2 px-2 py-1 rounded
              transition-colors
              ${
                activeFormId === form.id
                  ? "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            {form.label}
          </button>

          {activeFormId === form.id && (
            <nav className="space-y-1">
              {form.views.map((view) => (
                <FormNavItem
                  key={view.id}
                  viewId={view.id}
                  label={view.label}
                  isActive={form.state.activeView === view.id}
                  isVisited={form.state.visitedViews.includes(view.id)}
                  errorCount={form.state.errorCounts[view.id] || 0}
                  onClick={() => form.ref.current?.setActiveView(view.id)}
                />
              ))}
            </nav>
          )}
        </div>
      ))}
    </aside>
  );
}
