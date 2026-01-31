"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import type { FormData } from "@/lib/schemas/formSchema";

export function ContactDetailsView() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Contact Details</h3>
        <p className="text-gray-600 dark:text-gray-400">How can we reach you?</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="you@example.com"
        />

        <Input
          label="Phone Number"
          type="tel"
          {...register("phone")}
          error={errors.phone?.message}
          placeholder="+1 (555) 000-0000"
        />
      </div>
    </div>
  );
}
