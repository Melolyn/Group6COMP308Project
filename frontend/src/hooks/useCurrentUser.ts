import { useMemo } from "react";
import { authService } from "../services/authService";

export function useCurrentUser() {
  return useMemo(() => authService.getCurrentUser(), []);
}