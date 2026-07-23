import { Routes, Route } from "react-router-dom";
import { LoginPage } from "@/pages/auth/Login";
import { RegisterPage } from "@/pages/auth/Register";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPassword";
import { DashboardPage } from "@/pages/Dashboard";
import { ConversationPage } from "@/pages/Conversation";
import { PlacementTestPage } from "@/pages/PlacementTest";
import { ReviewPage } from "@/pages/Review";
import { ShadowingPage } from "@/pages/Shadowing";
import { StatisticsPage } from "@/pages/Statistics";
import { SettingsPage } from "@/pages/Settings";
import { LessonsPage } from "@/pages/Lessons";
import { LessonPage } from "@/pages/Lesson";
import { TeacherReportPage } from "@/pages/TeacherReport";
import { PrivateRoute } from "@/components/layout/PrivateRoute";
import { RequirePlacementTest } from "@/components/layout/RequirePlacementTest";
import { ROUTES } from "@/constants/routes";

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />
      <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />

      <Route
        path={ROUTES.placementTest}
        element={
          <PrivateRoute>
            <PlacementTestPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.settings}
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.dashboard}
        element={
          <PrivateRoute>
            <RequirePlacementTest>
              <DashboardPage />
            </RequirePlacementTest>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.conversation}
        element={
          <PrivateRoute>
            <RequirePlacementTest>
              <ConversationPage />
            </RequirePlacementTest>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.review}
        element={
          <PrivateRoute>
            <RequirePlacementTest>
              <ReviewPage />
            </RequirePlacementTest>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.shadowing}
        element={
          <PrivateRoute>
            <RequirePlacementTest>
              <ShadowingPage />
            </RequirePlacementTest>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.statistics}
        element={
          <PrivateRoute>
            <RequirePlacementTest>
              <StatisticsPage />
            </RequirePlacementTest>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.lessons}
        element={
          <PrivateRoute>
            <RequirePlacementTest>
              <LessonsPage />
            </RequirePlacementTest>
          </PrivateRoute>
        }
      />
      <Route
        path={`${ROUTES.lessons}/:lessonId`}
        element={
          <PrivateRoute>
            <RequirePlacementTest>
              <LessonPage />
            </RequirePlacementTest>
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.report}
        element={
          <PrivateRoute>
            <RequirePlacementTest>
              <TeacherReportPage />
            </RequirePlacementTest>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
