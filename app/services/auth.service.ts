import api from "../lib/apiClient";
import { LoginRequest } from "../lib/types/auth";
import { UserDTO } from "../lib/types/user";

export const login = async (data: LoginRequest) => {
  const res = await api.post("/auth/generateToken", data);
  return res.data;
};

export const register = async (data: UserDTO) => {
  const res = await api.post("/auth/addNewUser", data);
  return res.data;
};