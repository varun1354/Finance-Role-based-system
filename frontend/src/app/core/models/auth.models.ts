export interface LoginPayload {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      phone?: string;
      status?: string;
    };
  };
}

export interface StoredUserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  status?: string;
}
