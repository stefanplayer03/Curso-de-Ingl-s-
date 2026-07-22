import { Routes, Route } from "react-router-dom";
import { LoginPage } from "@/pages/auth/Login";
import { RegisterPage } from "@/pages/auth/Register";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPassword";
import { DashboardPage } from "@/pages/Dashboard";
import { ConversationPage } from "@/pages/Conversation";
import { PlacementTestPage } from "@/pages/PlacementTest";
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
    </Routes>
  );
}
