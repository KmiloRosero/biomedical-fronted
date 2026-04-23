export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
