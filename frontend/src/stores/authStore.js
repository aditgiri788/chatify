import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  checkingAuth: false,
  updatingProfile: false,

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      const { userData, message } = response.data;
      console.log("Signup response:", response.data);
      set({ authUser: userData });
      toast.success(message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      console.error("Signup failed:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async () => {

  },
  checkAuth: async () => {},
  updateProfile: async () => {},
}));
