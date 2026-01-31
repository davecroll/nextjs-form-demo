"use client";

import { useFormContext, Controller } from "react-hook-form";
import { FormData } from "@/lib/schemas/formSchema";

export function PreferencesView() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Preferences
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your experience.
        </p>
      </div>

      <div className="space-y-6">
        {/* Newsletter Checkbox */}
        <div className="flex items-start gap-3">
          <Controller
            name="newsletter"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <input
                type="checkbox"
                id="newsletter"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                {...field}
              />
            )}
          />
          <label htmlFor="newsletter" className="text-sm">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Subscribe to newsletter
            </span>
            <p className="text-gray-600 dark:text-gray-400">
              Get updates about new features and tips.
            </p>
          </label>
        </div>

        {/* Notifications Select */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="notifications"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Notification Frequency
          </label>
          <select
            id="notifications"
            {...register("notifications")}
            className="
              px-3 py-2 border rounded-md
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            "
          >
            <option value="all">All notifications</option>
            <option value="important">Important only</option>
            <option value="none">None</option>
          </select>
          {errors.notifications && (
            <span className="text-sm text-red-500">
              {errors.notifications.message}
            </span>
          )}
        </div>

        {/* Theme Radio Group */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme
          </legend>
          <div className="space-y-2">
            {[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register("theme")}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {errors.theme && (
            <span className="text-sm text-red-500">{errors.theme.message}</span>
          )}
        </fieldset>
      </div>
    </div>
  );
}
