import { create } from "zustand";
export type RefetchState = {
  refetch: any;
  setRefetch: (data: any) => void;
};

export const useRefetchStore = create<RefetchState>((set) => ({
  refetch: null,
  setRefetch: (fn: any) => set({ refetch: fn }),
}));
