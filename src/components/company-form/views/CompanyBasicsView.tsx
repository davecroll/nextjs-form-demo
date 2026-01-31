"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import type { CompanyFormData } from "@/lib/schemas/companySchema";

export function CompanyBasicsView() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CompanyFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Company Basics
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about your company.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Company Name"
          {...register("companyName")}
          error={errors.companyName?.message}
          placeholder="Acme Inc."
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="industry"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Industry
          </label>
          <select
            id="industry"
            {...register("industry")}
            className={`
              px-3 py-2 border rounded-md
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.industry ? "border-red-500 dark:border-red-400" : ""}
            `}
          >
            <option value="">Select an industry</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="retail">Retail</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="other">Other</option>
          </select>
          {errors.industry && (
            <span className="text-sm text-red-500 dark:text-red-400">
              {errors.industry.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
