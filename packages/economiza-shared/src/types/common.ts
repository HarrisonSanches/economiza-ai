// Common types and interfaces

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
