import { create } from "zustand";

interface SplashState {
    isVisible: boolean;
    hide: () => void;
}

export const useSplashStore = create<SplashState>((set) => ({
    isVisible: true,
    hide: () => set({ isVisible: false }),
}));