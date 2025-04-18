// User-related types

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO {
  name: string;
  email: string;
}
