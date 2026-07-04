let NetInfo: any;

if (process.env.NODE_ENV === "test") {
  NetInfo = {
    addEventListener: () => () => {},
    fetch: () => Promise.resolve({ isConnected: true }),
  };
} else {
  NetInfo = require("@react-native-community/netinfo").default;
}

import { useConsultationStore } from "../../modules/consultations/store/useConsultationStore";
import { useSyncStore } from "../store/useSyncStore";
import { useToastStore } from "../store/useToastStore";

let isListening = false;
let previousConnectedState = true;

export const syncManager = {
  init() {
    if (isListening) return () => {};
    isListening = true;

    NetInfo.fetch().then((state: any) => {
      previousConnectedState = state.isConnected ?? false;
    });

    const unsubscribe = NetInfo.addEventListener((state: any) => {
      const isConnected = state.isConnected ?? false;

      if (isConnected && !previousConnectedState) {
        this.processQueue();
      }

      previousConnectedState = isConnected;
    });

    return () => {
      unsubscribe();
      isListening = false;
    };
  },

  async processQueue() {
    const { queuedBookings, clearQueue } = useSyncStore.getState();
    const { bookAppointment } = useConsultationStore.getState();
    const { showToast } = useToastStore.getState();

    if (queuedBookings.length === 0) return;

    for (const booking of queuedBookings) {
      bookAppointment(booking);
    }

    clearQueue();
    showToast(
      "Sync Complete: Queued consultations synced successfully",
      "success",
    );
  },
};
