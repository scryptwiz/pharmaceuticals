import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { storage } from "../../../shared/lib/storage";
import { Booking } from "../utils/bookingUtils";

interface ConsultationState {
  bookings: Booking[];
  bookAppointment: (booking: Booking) => void;
  cancelAppointment: (docId: string, date: string, slot: string) => void;
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

export const useConsultationStore = create<ConsultationState>()(
  persist(
    (set) => ({
      bookings: [],
      bookAppointment: (booking) => {
        set((state) => ({
          bookings: [...state.bookings, booking],
        }));
      },
      cancelAppointment: (docId, date, slot) => {
        set((state) => ({
          bookings: state.bookings.filter(
            (b) => !(b.docId === docId && b.date === date && b.slot === slot),
          ),
        }));
      },
    }),
    {
      name: "consultation-storage",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
