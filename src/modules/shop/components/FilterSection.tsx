import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../../../shared/design-system/theme";
import { FetchProductsParams } from "../api/useProducts";

interface FilterSectionProps {
  params: FetchProductsParams;
  onChangeParams: (newParams: FetchProductsParams) => void;
}

const CATEGORIES = [
  "All",
  "Herbal Supplements",
  "Wellness Oils",
  "Skin Care & Beauty",
  "Organic Foods",
  "Teas & Infusions",
  "Hair Care",
  "Digestive Care",
  "Immunity Boosters",
];

const SORT_OPTIONS: { label: string; value: FetchProductsParams["sortBy"] }[] =
  [
    { label: "Default", value: "default" },
    { label: "Price: Low to High", value: "priceAsc" },
    { label: "Price: High to Low", value: "priceDesc" },
    { label: "Top Rated", value: "rating" },
  ];

export default function FilterSection({
  params,
  onChangeParams,
}: FilterSectionProps) {
  const handleSearch = (text: string) => {
    onChangeParams({ ...params, query: text || undefined });
  };

  const handleCategorySelect = (category: string) => {
    onChangeParams({
      ...params,
      category: category === "All" ? undefined : category,
    });
  };

  const handleSortSelect = (sort: FetchProductsParams["sortBy"]) => {
    onChangeParams({ ...params, sortBy: sort });
  };

  const activeCategory = params.category || "All";
  const activeSort = params.sortBy || "default";

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.inactive}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search 20,000+ products..."
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleCategorySelect(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortScroll}
        >
          {SORT_OPTIONS.map((opt) => {
            const isSelected = activeSort === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[styles.sortChip, isSelected && styles.sortChipSelected]}
                onPress={() => handleSortSelect(opt.value)}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    isSelected && styles.sortChipTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
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
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
    marginLeft: 16,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  chip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: Colors.text,
  },
  chipTextSelected: {
    color: Colors.textLight,
    fontWeight: "600",
  },
  sortScroll: {
    paddingHorizontal: 16,
  },
  sortChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  sortChipSelected: {
    backgroundColor: Colors.border,
  },
  sortChipText: {
    fontSize: 12,
    color: Colors.text,
  },
  sortChipTextSelected: {
    fontWeight: "600",
    color: Colors.primary,
  },
});
