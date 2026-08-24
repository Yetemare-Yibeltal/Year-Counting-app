import axios from "axios";

const API_URL =
  (import.meta as unknown as { env: Record<string, string> }).env
    .VITE_API_URL || "http://localhost:5000/api";

export const authService = {
  async register(data: Record<string, unknown>) {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  async login(credentials: Record<string, unknown>) {
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
