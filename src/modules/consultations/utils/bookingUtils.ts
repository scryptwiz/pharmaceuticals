export interface Booking {
  docId: string;
  docName: string;
  date: string;
  slot: string;
  patientName: string;
}

export function isSlotExpired(dateStr: string, slotTime: string): boolean {
  const now = new Date();

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = slotTime.split(":").map(Number);

  const slotDate = new Date(year, month - 1, day, hours, minutes);

  return slotDate.getTime() < now.getTime();
}

export function checkSlotConflict(
  newBooking: { docId: string; date: string; slot: string },
  existingBookings: Booking[],
): { hasConflict: boolean; reason?: string } {
  for (const b of existingBookings) {
    if (b.date === newBooking.date && b.slot === newBooking.slot) {
      if (b.docId === newBooking.docId) {
        return {
          hasConflict: true,
          reason: "This doctor is already booked at this time slot.",
        };
      }
      return {
        hasConflict: true,
        reason:
          "You already have another consultation booked at this time slot.",
      };
    }
  }
  return { hasConflict: false };
}
