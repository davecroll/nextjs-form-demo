import { RefObject } from "react";
import { ViewId, formViews } from "@/lib/schemas/formSchema";

export interface MultiViewFormHandle {
  setActiveView: (viewId: ViewId) => void;
  goToNextView: () => void;
  goToPreviousView: () => void;
}

export interface FormState {
  activeView: ViewId;
  visitedViews: ViewId[];
  errorCounts: Record<ViewId, number>;
}

export interface FormRegistration {
  id: string;
  label: string;
  ref: RefObject<MultiViewFormHandle | null>;
  views: typeof formViews;
  state: FormState;
}
