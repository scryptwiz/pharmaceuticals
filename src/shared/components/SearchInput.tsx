import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "../design-system/theme";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
}

export default function SearchInput({
  value,
  onChangeText,
  placeholder,
  style,
}: SearchInputProps) {
  return (
    <View style={[styles.searchRow, style]}>
      <Ionicons
        name="search"
        size={20}
        color={Colors.inactive}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={Colors.inactive}
      />
      {value ? (
        <Pressable onPress={() => onChangeText("")} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={Colors.inactive} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 8,
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
});
