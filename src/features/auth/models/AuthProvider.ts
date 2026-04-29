export type AuthProviderId = "password" | "github" | "google";

export type AuthProvider = {
  id: AuthProviderId;
  label: string;
};
