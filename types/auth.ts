export interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
  avatarUrl?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  isDemo?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  currency?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  loginAsDemoGuest: () => Promise<User>;
  logout: () => Promise<void>;
}
