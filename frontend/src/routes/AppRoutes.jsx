import { lazy } from "react";

/* Public pages */
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const HomePage = lazy(() => import("../pages/HomePage"));

/* User pages */
const InventoryPage = lazy(() => import("../pages/InventoryPage"));

/* Utility pages */
const RoleRedirector = lazy(() => import("./RoleRedirector"));

export const appRoutes = [
  {
    path: "/login",
    component: Login,
    requiresAuth: false,
    hideHeader: true,
  },
  {
    path: "/register",
    component: Register,
    requiresAuth: false,
    hideHeader: true,
  },

  // Redirect after login
  {
    path: "/redirect",
    component: RoleRedirector,
    requiresAuth: false,
    hideHeader: true,
  },

  // Main inventory (USER only for now)
  {
    path: "/",
    component: HomePage,
    requiresAuth: true,
    allowedRoles: ["user", "admin", "guest"], // future-ready
  },
  {
    path: "/inventories",
    component: InventoryPage,
    requiresAuth: true,
    allowedRoles: ["user", "admin"],
  },
];
