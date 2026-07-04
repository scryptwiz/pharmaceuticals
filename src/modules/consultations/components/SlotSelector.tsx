import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../shared/design-system/theme";
import { Booking, isSlotExpired } from "../utils/bookingUtils";

interface SlotSelectorProps {
  slots: string[];
  date: string;
  docId: string;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  existingBookings: Booking[];
}

export default function SlotSelector({
  slots,
  date,
  docId,
  selectedSlot,
  onSelectSlot,
  existingBookings,
}: SlotSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Available Slot</Text>
      <View style={styles.grid}>
        {slots.map((slot) => {
          const expired = isSlotExpired(date, slot);
          const isBookedByUser = existingBookings.some(
            (b) => b.docId === docId && b.date === date && b.slot === slot,
          );
          const isConflicting = existingBookings.some(
            (b) => b.docId !== docId && b.date === date && b.slot === slot,
          );
          const isSelected = selectedSlot === slot;

          let slotStyle = styles.slotAvailable;
          let textStyle = styles.textAvailable;
          let disabled = false;

          if (expired) {
            slotStyle = styles.slotExpired;
            textStyle = styles.textExpired;
            disabled = true;
          } else if (isBookedByUser) {
            slotStyle = styles.slotBooked;
            textStyle = styles.textBooked;
            disabled = true;
          } else if (isConflicting) {
            slotStyle = styles.slotConflict;
            textStyle = styles.textConflict;
            disabled = true;
          } else if (isSelected) {
            slotStyle = styles.slotSelected;
            textStyle = styles.textSelected;
          }

          return (
            <Pressable
              key={slot}
              style={[styles.slotBase, slotStyle]}
              onPress={() => !disabled && onSelectSlot(slot)}
              disabled={disabled}
            >
              <Text style={[styles.textBase, textStyle]}>{slot}</Text>
              {isBookedByUser && (
                <Text style={styles.bookedBadge} numberOfLines={1}>
                  Booked
                </Text>
              )}
              {isConflicting && (
                <Text style={styles.conflictBadge} numberOfLines={1}>
                  Conflict
                </Text>
              )}
              {expired && (
                <Text style={styles.expiredBadge} numberOfLines={1}>
                  Expired
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  slotBase: {
    width: "30%",
    aspectRatio: 2.2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    margin: "1.66%",
    padding: 4,
  },
  textBase: {
    fontSize: 14,
    fontWeight: "600",
  },
  slotAvailable: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
  },
  textAvailable: {
    color: Colors.text,
  },
  slotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  textSelected: {
    color: Colors.textLight,
  },
  slotExpired: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  textExpired: {
    color: Colors.inactive,
  },
  slotConflict: {
    backgroundColor: Colors.errorBackground,
    borderColor: Colors.errorBorder,
  },
  textConflict: {
    color: Colors.error,
  },
  slotBooked: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  textBooked: {
    color: Colors.success,
  },
  conflictBadge: {
    fontSize: 9,
    color: Colors.error,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },
  bookedBadge: {
    fontSize: 9,
    color: Colors.success,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },
  expiredBadge: {
    fontSize: 9,
    color: Colors.inactive,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },
});
