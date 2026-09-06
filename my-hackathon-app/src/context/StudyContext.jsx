import React, { createContext, useContext, useState, useCallback } from 'react';

const StudyContext = createContext(null);

/**
 * Provides shared state for the quiz → plan-update flow.
 * When a student completes a quiz and clicks "Update Study Plan",
 * this context signals the dashboard / study-plan pages to show
 * the "AI Updated" notification.
 *
 * TODO(backend): Replace local state with real API calls that
 * trigger the AI to re-generate the study plan.
 */
export function StudyProvider({ children }) {
  const [planUpdated, setPlanUpdated] = useState(false);
  const [lastQuizResult, setLastQuizResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const triggerPlanUpdate = useCallback((quizResult) => {
    setLastQuizResult(quizResult);
    setPlanUpdated(true);
  }, []);

  const dismissPlanUpdate = useCallback(() => {
    setPlanUpdated(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <StudyContext.Provider
      value={{
        planUpdated,
        lastQuizResult,
        triggerPlanUpdate,
        dismissPlanUpdate,
        sidebarOpen,
        toggleSidebar,
        closeSidebar,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used within <StudyProvider>');
  return ctx;
}

export default StudyContext;
