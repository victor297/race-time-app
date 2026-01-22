import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,

  setToken: async (token) => {
    if (token) await AsyncStorage.setItem("auth_token", token);
    set({ token });
  },

  logout: async () => {
    await AsyncStorage.removeItem("auth_token");
    set({ token: null });
  },
}));
