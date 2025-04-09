import { create } from "zustand";

type TypingState = {
    hasFinishedTypingTitle: boolean;
    setHasFinishedTypingTitle: (value: boolean) => void;
};

export const useTypingStore = create<TypingState>((set) => ({
    hasFinishedTypingTitle: false,
    setHasFinishedTypingTitle: (value) => set({ hasFinishedTypingTitle: value }),
}));