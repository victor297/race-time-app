import { create } from "zustand";

export type RegisterStateData = {
  fullname: string;
  email: string;
  phoneNumber: string;
  token: string;
};

export type RegisterState = {
  data: RegisterStateData | null;
  setRegister: (data: RegisterStateData) => Promise<void>;
  clearData: () => Promise<void>;
};

export const useRegisterStore = create<RegisterState>((set) => ({
  data: null,

  setRegister: async (data) => {
    // ✅ Properly update only the `data` field
    set({ data });
  },

  clearData: async () => {
    // ✅ Reset to initial state
    set({ data: null });
  },
}));
