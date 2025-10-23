import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return navigateTo("/login");
  }

  const { userType } = JSON.parse(user);
  const requiredRole = to.meta.role as "OWNER" | "VET" | undefined;

  if (requiredRole && userType !== requiredRole) {
    return navigateTo("/");
  }
});
