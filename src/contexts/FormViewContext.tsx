"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ViewId, formViews } from "@/lib/schemas/formSchema";

interface FormViewContextType {
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
  visitedViews: Set<ViewId>;
  markViewVisited: (view: ViewId) => void;
  goToNextView: () => void;
  goToPreviousView: () => void;
  isFirstView: boolean;
  isLastView: boolean;
}

const FormViewContext = createContext<FormViewContextType | null>(null);

export function FormViewProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveViewState] = useState<ViewId>("personal");
  const [visitedViews, setVisitedViews] = useState<Set<ViewId>>(
    new Set(["personal"])
  );

  const setActiveView = useCallback((view: ViewId) => {
    setActiveViewState(view);
    setVisitedViews((prev) => new Set([...prev, view]));
  }, []);

  const markViewVisited = useCallback((view: ViewId) => {
    setVisitedViews((prev) => new Set([...prev, view]));
  }, []);

  const currentIndex = formViews.findIndex((v) => v.id === activeView);
  const isFirstView = currentIndex === 0;
  const isLastView = currentIndex === formViews.length - 1;

  const goToNextView = useCallback(() => {
    if (currentIndex < formViews.length - 1) {
      const nextView = formViews[currentIndex + 1].id;
      setActiveView(nextView);
    }
  }, [currentIndex, setActiveView]);

  const goToPreviousView = useCallback(() => {
    if (currentIndex > 0) {
      const prevView = formViews[currentIndex - 1].id;
      setActiveView(prevView);
    }
  }, [currentIndex, setActiveView]);

  return (
    <FormViewContext.Provider
      value={{
        activeView,
        setActiveView,
        visitedViews,
        markViewVisited,
        goToNextView,
        goToPreviousView,
        isFirstView,
        isLastView,
      }}
    >
      {children}
    </FormViewContext.Provider>
  );
}

export function useFormView() {
  const context = useContext(FormViewContext);
  if (!context) {
    throw new Error("useFormView must be used within a FormViewProvider");
  }
  return context;
}
