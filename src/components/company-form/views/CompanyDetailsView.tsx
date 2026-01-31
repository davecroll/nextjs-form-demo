"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import type { CompanyFormData } from "@/lib/schemas/companySchema";

export function CompanyDetailsView() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CompanyFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Company Details</h3>
        <p className="text-gray-600 dark:text-gray-400">Additional information about your company.</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="companySize" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Company Size
          </label>
          <select
            id="companySize"
            {...register("companySize")}
            className={`
              px-3 py-2 border rounded-md
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.companySize ? "border-red-500 dark:border-red-400" : ""}
            `}
          >
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
          {errors.companySize && (
            <span className="text-sm text-red-500 dark:text-red-400">{errors.companySize.message}</span>
          )}
        </div>

        <Input
          label="Website"
          type="url"
          {...register("website")}
          error={errors.website?.message}
          placeholder="https://example.com"
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Company Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            placeholder="Tell us about what your company does..."
            className={`
              px-3 py-2 border rounded-md
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              resize-none
              ${errors.description ? "border-red-500 dark:border-red-400" : ""}
            `}
          />
          {errors.description && (
            <span className="text-sm text-red-500 dark:text-red-400">{errors.description.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}
