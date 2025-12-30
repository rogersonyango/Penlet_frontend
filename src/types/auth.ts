// src/types/auth.ts

export type Role = 'student' | 'teacher' | 'admin';

export interface User {
  id?: number;
  email: string;
  role: Role;
  name?: string;
}