import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Colors } from "../design-system/theme";

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Chip({
  label,
  selected,
  onPress,
  style,
  textStyle,
}: ChipProps) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected, style]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.chipTextSelected,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
