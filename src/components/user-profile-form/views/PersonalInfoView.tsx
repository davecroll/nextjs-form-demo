"use client";

import { useFormContext } from "react-hook-form";
import { FormData } from "@/lib/schemas/formSchema";
import { Input } from "@/components/ui/Input";

export function PersonalInfoView() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Personal Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please enter your personal details.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
          placeholder="Enter your first name"
        />

        <Input
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
          placeholder="Enter your last name"
        />
      </div>
    </div>
  );
}
