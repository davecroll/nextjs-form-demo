import { z } from "zod";

// Individual schemas per view
export const companyBasicsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
});

export const companyDetailsSchema = z.object({
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
  website: z.string().url("Invalid URL").or(z.literal("")),
  description: z.string().max(500, "Description must be 500 characters or less"),
});

// Unified schema for full-form validation
export const companySchema = z.object({
  ...companyBasicsSchema.shape,
  ...companyDetailsSchema.shape,
});

export type CompanyFormData = z.infer<typeof companySchema>;

// View configuration
export const companyViews = [
  {
    id: "basics",
    label: "Company Basics",
    fields: ["companyName", "industry"] as const,
  },
  {
    id: "details",
    label: "Company Details",
    fields: ["companySize", "website", "description"] as const,
  },
] as const;

export type CompanyViewId = (typeof companyViews)[number]["id"];

// Default form values
export const defaultCompanyValues: CompanyFormData = {
  companyName: "",
  industry: "",
  companySize: "1-10",
  website: "",
  description: "",
};
