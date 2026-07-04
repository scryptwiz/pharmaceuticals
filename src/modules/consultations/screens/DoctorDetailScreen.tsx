import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockDb } from "../../../mocks/mock-db";
import { Colors } from "../../../shared/design-system/theme";
import SlotSelector from "../components/SlotSelector";
import { useConsultationStore } from "../store/useConsultationStore";
import { checkSlotConflict } from "../utils/bookingUtils";

export default function DoctorDetailScreen({ route, navigation }: any) {
  const { doctorId } = route.params;
  const doctor = mockDb.getDoctors().find((d) => d.id === doctorId);

  // Generate next 3 days for booking dates
  const dates = Array.from({ length: 3 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { bookings, bookAppointment } = useConsultationStore();

  if (!doctor) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Doctor not found</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleBooking = () => {
    if (!selectedSlot) {
      Alert.alert("Error", "Please select a time slot first.");
      return;
    }

    const newBooking = {
      docId: doctor.id,
      date: selectedDate,
      slot: selectedSlot,
    };

    const conflictResult = checkSlotConflict(newBooking, bookings);
    if (conflictResult.hasConflict) {
      Alert.alert("Scheduling Conflict", conflictResult.reason);
      return;
    }

    bookAppointment({
      ...newBooking,
      docName: doctor.name,
      patientName: "Kelvin Ajayi",
    });

    Alert.alert(
      "Success",
      `Consultation booked with ${doctor.name} on ${selectedDate} at ${selectedSlot}.`,
      [{ text: "OK", onPress: () => navigation.goBack() }],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <View style={styles.headerSpacing} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Doctor Identity Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={Colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{doctor.name}</Text>
            <Text style={styles.specialty}>{doctor.specialty}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statChip}>
                <Ionicons name="star" size={14} color={Colors.star} />
                <Text style={styles.statText}>{doctor.rating} Rating</Text>
              </View>
              <View style={styles.statChip}>
                <Ionicons name="briefcase" size={14} color={Colors.primary} />
                <Text style={styles.statText}>{doctor.experience} Yrs Exp</Text>
              </View>
            </View>
          </View>
        </View>

        {/* sDescription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Doctor</Text>
          <Text style={styles.bio}>
            Dr. {doctor.name.split(" ").slice(1).join(" ")} is a certified
            expert in {doctor.specialty} with over {doctor.experience} years of
            clinical experience. Specializing in traditional Ayurvedic
            diagnostics and custom herbal therapy paths to support long-term
            metabolic health.
          </Text>
        </View>

        {/* Date Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Consultation Date</Text>
          <View style={styles.dateRow}>
            {dates.map((dateStr) => {
              const isSelected = selectedDate === dateStr;
              const formattedDate = new Date(dateStr).toLocaleDateString(
                undefined,
                {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                },
              );
              return (
                <Pressable
                  key={dateStr}
                  style={[
                    styles.dateChip,
                    isSelected && styles.dateChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedDate(dateStr);
                    setSelectedSlot(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.dateTextSelected,
                    ]}
                  >
                    {formattedDate}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Slots Selector */}
        <View style={styles.section}>
          <SlotSelector
            slots={doctor.availabilitySlots}
            date={selectedDate}
            docId={doctor.id}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            existingBookings={bookings}
          />
        </View>
      </ScrollView>

      {/* Booking CTA */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Consultation Fee</Text>
          <Text style={styles.priceValue}>₹500</Text>
        </View>
        <Pressable style={styles.bookCTA} onPress={handleBooking}>
          <Text style={styles.bookCTAText}>Book Consultation</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  headerSpacing: {
    width: 32,
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  specialty: {
    fontSize: 14,
    color: Colors.inactive,
    marginVertical: 4,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateChip: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    marginHorizontal: 4,
  },
  dateChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  dateTextSelected: {
    color: Colors.textLight,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  priceContainer: {
    flexDirection: "column",
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.inactive,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  bookCTA: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookCTAText: {
    color: Colors.textLight,
    fontWeight: "700",
    fontSize: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 12,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: Colors.textLight,
    fontWeight: "600",
  },
});
