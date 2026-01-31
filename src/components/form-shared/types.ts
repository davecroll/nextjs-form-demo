import type { RefObject } from "react";

// Generic view configuration type
export interface ViewConfig {
  id: string;
  label: string;
  fields: readonly string[];
}

// Generic form handle - works with any form data type
export interface MultiViewFormHandle<T = unknown> {
  setActiveView: (viewId: string) => Promise<void>;
  goToNextView: () => Promise<void>;
  goToPreviousView: () => Promise<void>;
  validate: () => Promise<boolean>;
  getValues: () => T;
}

export interface FormState {
  activeView: string;
  validatedViews: string[];
  errorCounts: Record<string, number>;
}

export interface FormRegistration<T = unknown> {
  id: string;
  label: string;
  ref: RefObject<MultiViewFormHandle<T> | null>;
  views: readonly ViewConfig[];
  state: FormState;
}
