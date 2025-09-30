import { create } from "zustand";

interface MessageStore {
  shouldGoDown: boolean;
  setGoDown(bool: boolean): void;
  reset(): void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  shouldGoDown: false,
  setGoDown(bool) {
    set({ shouldGoDown: bool });
  },
  reset() {
    set({
      shouldGoDown: false,
    });
  },
}));
