export interface AuthParams {
  username: string;
  password: string;
  type: string;
}

export interface UserParams {
  id: number;
  type: string;
}

export interface AuthResponse {
  token?: string;
  status?: boolean;
  message?: string;
}
