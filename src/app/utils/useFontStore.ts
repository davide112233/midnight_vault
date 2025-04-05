// store/useAppStore.ts
import { create } from "zustand";

type AppState = {
    hasMounted: boolean;
    setHasMounted: () => void;
};

export const useAppStore = create<AppState>((set) => ({
    hasMounted: false,
    setHasMounted: () => set({ hasMounted: true }),
}));