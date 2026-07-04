import {
  Booking,
  checkSlotConflict,
  isSlotExpired,
} from "../utils/bookingUtils";

describe("bookingUtils", () => {
  describe("isSlotExpired", () => {
    it("should return true for a slot in the past", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const dateStr = pastDate.toISOString().split("T")[0];

      expect(isSlotExpired(dateStr, "10:00")).toBe(true);
    });

    it("should return false for a slot in the future", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateStr = futureDate.toISOString().split("T")[0];

      expect(isSlotExpired(dateStr, "10:00")).toBe(false);
    });
  });

  describe("checkSlotConflict", () => {
    const existingBookings: Booking[] = [
      {
        docId: "doc-1",
        docName: "Dr. Sharma",
        date: "2026-07-10",
        slot: "09:00",
        patientName: "Kelvin Ajayi",
      },
      {
        docId: "doc-2",
        docName: "Dr. Patil",
        date: "2026-07-10",
        slot: "11:00",
        patientName: "Kelvin Ajayi",
      },
    ];

    it("should flag a conflict if booking the same doctor at the same time", () => {
      const newBooking = {
        docId: "doc-1",
        date: "2026-07-10",
        slot: "09:00",
      };

      const result = checkSlotConflict(newBooking, existingBookings);
      expect(result.hasConflict).toBe(true);
      expect(result.reason).toBe(
        "This doctor is already booked at this time slot.",
      );
    });

    it("should flag a conflict if patient has another booking at the same time with a different doctor", () => {
      const newBooking = {
        docId: "doc-3",
        date: "2026-07-10",
        slot: "11:00",
      };

      const result = checkSlotConflict(newBooking, existingBookings);
      expect(result.hasConflict).toBe(true);
      expect(result.reason).toBe(
        "You already have another consultation booked at this time slot.",
      );
    });

    it("should pass (no conflict) if slot and date do not overlap", () => {
      const newBooking = {
        docId: "doc-1",
        date: "2026-07-10",
        slot: "14:00",
      };

      const result = checkSlotConflict(newBooking, existingBookings);
      expect(result.hasConflict).toBe(false);
    });
  });
});
