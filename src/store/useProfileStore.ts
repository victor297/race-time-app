import { create } from "zustand";
import { UserDto } from "../types";

export type ProfileState = {
  data: UserDto | null;
  setProfile: (data: UserDto) => Promise<void>;
  clearProfileData: () => Promise<void>;
};

export const useProfileStore = create<ProfileState>((set) => ({
  data: null,
  setProfile: async (data) => {
    set({ data });
  },

  clearProfileData: async () => {
    set({ data: null });
  },
}));
