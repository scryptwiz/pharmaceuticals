import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { Booking } from "../../modules/consultations/utils/bookingUtils";
import { storage } from "../lib/storage";

interface SyncState {
  queuedBookings: Booking[];
  queueBooking: (booking: Booking) => void;
  dequeueBooking: (docId: string, date: string, slot: string) => void;
  clearQueue: () => void;
}

const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      queuedBookings: [],
      queueBooking: (booking) => {
        set((state) => ({
          queuedBookings: [...state.queuedBookings, booking],
        }));
      },
      dequeueBooking: (docId, date, slot) => {
        set((state) => ({
          queuedBookings: state.queuedBookings.filter(
            (b) => !(b.docId === docId && b.date === date && b.slot === slot),
          ),
        }));
      },
      clearQueue: () => set({ queuedBookings: [] }),
    }),
    {
      name: "sync-storage",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
