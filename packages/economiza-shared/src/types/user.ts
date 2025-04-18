// User-related types

export type UserRole = "user" | "admin";
export type AuthProvider = "local" | "google" | "github";

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  budgetAlerts: boolean;
}

export interface UserSettings {
  currency: string;
  language: string;
  notificationPreferences: NotificationPreferences;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  authProvider?: AuthProvider;
  settings?: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO {
  name: string;
  email: string;
  password?: string;
}
