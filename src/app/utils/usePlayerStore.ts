import { create } from "zustand";

interface PlayerStore {
    playing: boolean;
    volume: number;
    muted: boolean;
    togglePlay: () => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    playing: false,
    volume: 0.8,
    muted: false,
    togglePlay: () => set((state) => ({ playing: !state.playing })),
    setVolume: (volume: number) => set({ volume }),
    toggleMute: () => set((state) => ({ muted: !state.muted })),
}));