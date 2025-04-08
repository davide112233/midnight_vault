import { create } from "zustand";

interface MountedStore {
    isMounted: boolean;
    setMounted: (value: boolean) => void;
}

export const useMountedStore = create<MountedStore>((set) => ({
    isMounted: false,
    setMounted: (value) => set({ isMounted: value }),
}));