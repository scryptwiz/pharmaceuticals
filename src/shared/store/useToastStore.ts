import { create } from "zustand";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface ToastState {
  toast: Toast | null;
  showToast: (message: string, type?: Toast["type"]) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showToast: (message, type = "info") => {
    const id = Math.random().toString();
    set({ toast: { id, message, type } });

    setTimeout(() => {
      set((state) => {
        if (state.toast?.id === id) {
          return { toast: null };
        }
        return {};
      });
    }, 3500);
  },
  hideToast: () => set({ toast: null }),
}));
