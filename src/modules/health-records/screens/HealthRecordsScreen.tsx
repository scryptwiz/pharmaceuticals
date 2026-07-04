import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Chip from "../../../shared/components/Chip";
import SearchInput from "../../../shared/components/SearchInput";
import { Colors } from "../../../shared/design-system/theme";
import {
  FetchHealthRecordsParams,
  useHealthRecords,
} from "../api/useHealthRecords";
import { groupRecordsByMonthYear } from "../utils/grouping";

const RECORD_TYPES = [
  "All",
  "Lab Report",
  "Prescription",
  "Vaccination",
  "Discharge Summary",
];

export default function HealthRecordsScreen() {
  const [params, setParams] = useState<FetchHealthRecordsParams>({});
  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useHealthRecords(params);

  const handleSearch = (text: string) => {
    setParams((prev) => ({ ...prev, query: text || undefined }));
  };

  const handleTypeSelect = (type: string) => {
    setParams((prev) => ({
      ...prev,
      type: type === "All" ? undefined : type,
    }));
  };

  const activeType = params.type || "All";

  // Avoid regrouping on every render
  const sections = useMemo(() => {
    return groupRecordsByMonthYear(records);
  }, [records]);

  const renderSectionHeader = ({ section: { title } }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }: any) => {
    let typeIcon: keyof typeof Ionicons.glyphMap = "document-text-outline";
    let typeColor = Colors.primary;

    if (item.type === "Lab Report") {
      typeIcon = "analytics-outline";
      typeColor = Colors.accent;
    } else if (item.type === "Prescription") {
      typeIcon = "receipt-outline";
      typeColor = Colors.success;
    } else if (item.type === "Vaccination") {
      typeIcon = "shield-checkmark-outline";
      typeColor = Colors.star;
    }

    return (
      <View
        accessible={true}
        accessibilityRole="none"
        accessibilityLabel={`${item.type}: ${item.title}. Date: ${item.date}. Facility: ${item.facility}. Patient: ${item.patientName}. Notes: ${item.notes}`}
        style={styles.recordCard}
      >
        <View style={styles.timelineCol}>
          <View
            style={[
              styles.typeIconContainer,
              { backgroundColor: typeColor + "15" },
            ]}
          >
            <Ionicons name={typeIcon} size={20} color={typeColor} />
          </View>
          <View style={styles.timelineLine} />
        </View>

        <View style={styles.contentCol}>
          <View style={styles.cardHeader}>
            <Text style={styles.recordTitle}>{item.title}</Text>
            <Text style={styles.recordDate}>{item.date}</Text>
          </View>
          <Text style={styles.facilityText}>{item.facility}</Text>
          <Text style={styles.patientText}>Patient: {item.patientName}</Text>
          <Text style={styles.notesText} numberOfLines={2}>
            {item.notes}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header Search */}
      <SearchInput
        value={params.query || ""}
        onChangeText={handleSearch}
        placeholder="Search records or notes..."
        style={styles.searchBar}
      />

      {/* Filter Section Chips */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {RECORD_TYPES.map((type) => {
            const isSelected = activeType === type;
            return (
              <Chip
                key={type}
                label={type}
                selected={isSelected}
                onPress={() => handleTypeSelect(type)}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Main List content */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading timeline...</Text>
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Failed to load records</Text>
          <Text style={styles.errorSubtext}>
            {(error as any)?.message || "Network Error"}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="folder-open-outline"
            size={48}
            color={Colors.inactive}
          />
          <Text style={styles.emptyText}>No records found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting search query or filters.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  filterSection: {
    marginVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    backgroundColor: Colors.background,
    paddingVertical: 10,
    marginTop: 12,
  },
  sectionHeaderText: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.primary,
  },
  recordCard: {
    flexDirection: "row",
    marginBottom: 8,
  },
  timelineCol: {
    alignItems: "center",
    marginRight: 12,
    width: 36,
  },
  typeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  contentCol: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  recordDate: {
    fontSize: 11,
    color: Colors.inactive,
    fontWeight: "600",
  },
  facilityText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  patientText: {
    fontSize: 11,
    color: Colors.inactive,
    marginTop: 2,
  },
  notesText: {
    fontSize: 12,
    color: Colors.text,
    lineHeight: 16,
    marginTop: 8,
    opacity: 0.8,
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
