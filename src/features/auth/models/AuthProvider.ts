export type AuthProviderId = "password" | "github" | "facebook";

export type AuthProvider = {
  id: AuthProviderId;
  label: string;
};
