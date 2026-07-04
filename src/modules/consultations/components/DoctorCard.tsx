import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../shared/design-system/theme";
import { Doctor } from "../api/useDoctors";

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

export default function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={32} color={Colors.primary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>

        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Ionicons name="star" size={14} color={Colors.star} />
            <Text style={styles.metaText}>{doctor.rating}</Text>
          </View>

          <View style={styles.meta}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={Colors.inactive}
            />
            <Text style={styles.metaText}>{doctor.experience} Yrs Exp</Text>
          </View>
        </View>
      </View>

      <View style={styles.action}>
        <Ionicons name="chevron-forward" size={20} color={Colors.inactive} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  specialty: {
    fontSize: 13,
    color: Colors.inactive,
    marginTop: 2,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 4,
  },
  action: {
    paddingLeft: 8,
  },
});
