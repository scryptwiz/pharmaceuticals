import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Chip from "../../../shared/components/Chip";
import SearchInput from "../../../shared/components/SearchInput";
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
      <SearchInput
        value={params.query || ""}
        onChangeText={handleSearch}
        placeholder="Search 20,000+ products..."
        style={styles.searchBar}
      />

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
              <Chip
                key={cat}
                label={cat}
                selected={isSelected}
                onPress={() => handleCategorySelect(cat)}
              />
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
                accessible={true}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Sort by ${opt.label}`}
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
  searchBar: {
    marginHorizontal: 16,
    marginTop: 12,
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
