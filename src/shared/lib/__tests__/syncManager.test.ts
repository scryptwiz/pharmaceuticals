import { describe, expect, it } from "bun:test";
import { useConsultationStore } from "../../../modules/consultations/store/useConsultationStore";
import { useSyncStore } from "../../store/useSyncStore";
import { useToastStore } from "../../store/useToastStore";
import { syncManager } from "../sync-manager";

describe("syncManager", () => {
  it("should process queued offline bookings when connection is restored", async () => {
    useSyncStore.getState().clearQueue();
    useConsultationStore.setState({ bookings: [] });
    useToastStore.getState().hideToast();

    const booking = {
      docId: "doc-1",
      docName: "Dr. Sharma",
      patientName: "Kelvin Ajayi",
      date: "2026-07-05",
      slot: "09:00 AM",
    };

    useSyncStore.getState().queueBooking(booking);
    expect(useSyncStore.getState().queuedBookings).toHaveLength(1);

    await syncManager.processQueue();

    expect(useConsultationStore.getState().bookings).toHaveLength(1);
    expect(useConsultationStore.getState().bookings[0].docId).toBe("doc-1");

    expect(useSyncStore.getState().queuedBookings).toHaveLength(0);

    expect(useToastStore.getState().toast?.message).toContain("Sync Complete");
  });
});
