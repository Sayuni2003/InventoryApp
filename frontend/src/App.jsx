import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { appRoutes } from "./routes/AppRoutes";
import ProtectedRoute from "./routes/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";

const renderRoutes = (routes) =>
  routes.map(
    ({
      path,
      component: Component,
      requiresAuth,
      allowedRoles,
      hideHeader,
    }) => {
      const element = requiresAuth ? (
        <ProtectedRoute allowedRoles={allowedRoles}>
          <Component />
        </ProtectedRoute>
      ) : (
        <Component />
      );

      // With or without layout
      return hideHeader ? (
        <Route key={path} path={path} element={element} />
      ) : (
        <Route key={path} element={<MainLayout />}>
          <Route path={path} element={element} />
        </Route>
      );
    }
  );

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>{renderRoutes(appRoutes)}</Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
