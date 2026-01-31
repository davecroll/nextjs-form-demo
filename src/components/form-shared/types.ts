import type { RefObject } from "react";

// Generic view configuration type
export interface ViewConfig {
  id: string;
  label: string;
  fields: readonly string[];
}

// Generic form handle - works with any form data type
export interface MultiViewFormHandle<T = unknown> {
  setActiveView: (viewId: string) => void;
  goToNextView: () => Promise<void>;
  goToPreviousView: () => Promise<void>;
  validateCurrentView: () => Promise<boolean>;
  validate: () => Promise<boolean>;
  getValues: () => T;
  getActiveView: () => string;
}

export interface FormState {
  activeView: string;
  visitedViews: string[];
  errorCounts: Record<string, number>;
}

export interface FormRegistration<T = unknown> {
  id: string;
  label: string;
  ref: RefObject<MultiViewFormHandle<T> | null>;
  views: readonly ViewConfig[];
  state: FormState;
}
