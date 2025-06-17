import { create } from "zustand";

interface TabStore {
  index: number;
  setIndex: (index: number) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  index: 0,
  setIndex: (index) => set({ index }),
}));
