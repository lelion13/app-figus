import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeamGridPage from "./pages/TeamGridPage";
import TeamsPage from "./pages/TeamsPage";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route
          path="/equipos"
          element={
            <PrivateRoute>
              <TeamsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/equipos/:teamName"
          element={
            <PrivateRoute>
              <TeamGridPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/equipos" replace />} />
      </Routes>
    </AuthProvider>
  );
}
