import axios from "axios";

const API_URL =
  (import.meta as unknown as { env: Record<string, string> }).env
    .VITE_API_URL || "http://localhost:5000/api";

export interface LoginData {
  email?: string;
  username?: string;
  password?: string;
  [key: string]: unknown;
}

export interface RegisterData {
  email?: string;
  username?: string;
  password?: string;
  [key: string]: unknown;
}

export const authService = {
  getCurrentToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  async register(data: RegisterData) {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  async login(credentials: LoginData) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      withCredentials: true,
    });
    return response.data;
  },

  async logout() {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  },
};

export default authService;
