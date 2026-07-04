import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Chip from "../../../shared/components/Chip";
import { Colors } from "../../../shared/design-system/theme";
import { FetchDoctorsParams, useDoctors } from "../api/useDoctors";
import DoctorCard from "../components/DoctorCard";

const SPECIALTIES = [
  "All",
  "Kayachikitsa (General Medicine)",
  "Shalya Tantra (Surgery)",
  "Shalakya Tantra (ENT & Ophthalmology)",
  "Kaumarbhritya (Pediatrics)",
  "Panchakarma (Detoxification)",
  "Rasayana (Rejuvenation)",
  "Prasuti Tantra (Obstetrics & Gynecology)",
  "Bhuta Vidya (Psychiatry)",
];

export default function ConsultationsScreen({ navigation }: any) {
  const [params, setParams] = useState<FetchDoctorsParams>({});
  const {
    data: doctors = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDoctors(params);

  const handleSearch = (text: string) => {
    setParams((prev) => ({ ...prev, query: text || undefined }));
  };

  const handleSpecialtySelect = (specialty: string) => {
    setParams((prev) => ({
      ...prev,
      specialty: specialty === "All" ? undefined : specialty,
    }));
  };

  const activeSpecialty = params.specialty || "All";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.searchRow}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.inactive}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search 5,000+ doctors..."
          value={params.query || ""}
          onChangeText={handleSearch}
          placeholderTextColor={Colors.inactive}
        />
        {params.query ? (
          <Pressable
            onPress={() => handleSearch("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={Colors.inactive} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.specialtySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.specialtyScroll}
        >
          {SPECIALTIES.map((spec) => {
            const isSelected = activeSpecialty === spec;
            return (
              <Chip
                key={spec}
                label={spec.split(" ")[0]}
                selected={isSelected}
                onPress={() => handleSpecialtySelect(spec)}
              />
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading doctors...</Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Failed to load doctors</Text>
          <Text style={styles.errorSubtext}>
            {(error as any)?.message || "Network Error"}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : doctors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={48} color={Colors.inactive} />
          <Text style={styles.emptyText}>No doctors found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting search query or specialty.
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            data={doctors}
            renderItem={({ item }) => (
              <DoctorCard
                doctor={item}
                onPress={() =>
                  navigation.navigate("DoctorDetail", { doctorId: item.id })
                }
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.text,
  },
  clearButton: {
    padding: 4,
  },
  specialtySection: {
    marginVertical: 12,
  },
  specialtyScroll: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: Colors.inactive,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.inactive,
    marginTop: 4,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 16,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.inactive,
    marginTop: 4,
    textAlign: "center",
  },
});
