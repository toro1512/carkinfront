export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'admin' | 'dealer' | 'customer';

export interface LoginCredentials {
  email: string;
  password: string;
  capchat:string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name:string;
  email: string;
  password: string;
  capchat: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface DecodedToken {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}