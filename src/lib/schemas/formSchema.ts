import { z } from "zod";

// Individual schemas per view
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const contactDetailsSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export const preferencesSchema = z.object({
  newsletter: z.boolean(),
  notifications: z.enum(["all", "important", "none"]),
  theme: z.enum(["light", "dark", "system"]),
});

// Unified schema for full-form validation
export const formSchema = z.object({
  ...personalInfoSchema.shape,
  ...contactDetailsSchema.shape,
  ...preferencesSchema.shape,
});

export type FormData = z.infer<typeof formSchema>;

// View configuration - maps fields to views for error aggregation
export const formViews = [
  {
    id: "personal",
    label: "Personal Info",
    fields: ["firstName", "lastName"] as const,
  },
  {
    id: "contact",
    label: "Contact Details",
    fields: ["email", "phone"] as const,
  },
  {
    id: "preferences",
    label: "Preferences",
    fields: ["newsletter", "notifications", "theme"] as const,
  },
] as const;

export type ViewId = (typeof formViews)[number]["id"];

// Default form values
export const defaultFormValues: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  newsletter: false,
  notifications: "all",
  theme: "system",
};
