"use client";

import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormViewProvider } from "@/contexts/FormViewContext";
import { formSchema, FormData, defaultFormValues } from "@/lib/schemas/formSchema";

interface MultiViewFormProviderProps {
  children: ReactNode;
  onSubmit?: (data: FormData) => void;
}

export function MultiViewFormProvider({
  children,
  onSubmit,
}: MultiViewFormProviderProps) {
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
    mode: "onBlur",
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit?.(data);
  });

  return (
    <FormViewProvider>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="flex h-full">
          {children}
        </form>
      </FormProvider>
    </FormViewProvider>
  );
}
