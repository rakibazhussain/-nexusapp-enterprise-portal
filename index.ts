// src/models/index.ts
export type UserRole = 'General User' | 'Admin';

export interface User {
  id: string;
  userId: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
  email: string;
  department: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Record {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Pending' | 'Closed' | 'Archived';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  accessLevel: 'Public' | 'Restricted' | 'Confidential';
  tags: string[];
  value?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  processingTimeMs?: number;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'passwordHash'>;
  expiresIn: number;
}

export interface CreateUserRequest {
  userId: string;
  password: string;
  role: UserRole;
  fullName: string;
  email: string;
  department: string;
}