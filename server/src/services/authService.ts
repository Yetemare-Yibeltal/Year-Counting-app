import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:5000/api";

export const authService = {
  async verifyToken(token: string) {
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
