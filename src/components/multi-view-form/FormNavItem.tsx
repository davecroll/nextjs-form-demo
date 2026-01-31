"use client";

import { ViewId } from "@/lib/schemas/formSchema";

interface FormNavItemProps {
  viewId: ViewId;
  label: string;
  isActive: boolean;
  isVisited: boolean;
  errorCount: number;
  onClick: () => void;
}

export function FormNavItem({
  label,
  isActive,
  isVisited,
  errorCount,
  onClick,
}: FormNavItemProps) {
  const hasErrors = errorCount > 0;
  const isValid = isVisited && !hasErrors;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-3 text-left
        rounded-lg transition-colors
        ${
          isActive
            ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        }
      `}
    >
      <span className="font-medium">{label}</span>
      <span className="flex items-center gap-2">
        {hasErrors && (
          <span
            className="
              inline-flex items-center justify-center
              min-w-[20px] h-5 px-1.5
              text-xs font-medium
              bg-red-500 text-white rounded-full
            "
          >
            {errorCount}
          </span>
        )}
        {isValid && (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
