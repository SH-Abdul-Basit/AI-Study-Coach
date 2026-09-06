import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudyProvider } from "./context/StudyContext";
import Landing from "./pages/Landing";
import StudyCoachSignUp from "./pages/Sign-up";
import StudyCoachSignIn from "./pages/Sign-in";
import Questionaire from "./pages/Questainaire";
import AppLayout from "./components/layout/AppLayout";
import { lazy, Suspense } from "react";

// Lazy-load authenticated pages for better bundle splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudyPlanPage = lazy(() => import("./pages/StudyPlanPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const PracticePage = lazy(() => import("./pages/PracticePage"));
const PastPapersPage = lazy(() => import("./pages/PastPapersPage"));
const AICoachPage = lazy(() => import("./pages/AICoachPage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const MaterialsPage = lazy(() => import("./pages/MaterialsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-3 border-[#6347F5] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <StudyProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<StudyCoachSignUp />} />
            <Route path="/login" element={<StudyCoachSignIn />} />
            <Route path="/questainaire" element={<Questionaire />} />

            {/* Authenticated routes with shared layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/study-plan" element={<StudyPlanPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/past-papers" element={<PastPapersPage />} />
              <Route path="/ai-coach" element={<AICoachPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </StudyProvider>
  );
}

export default App;