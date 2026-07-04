import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../design-system/theme";
import { useToastStore } from "../store/useToastStore";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast, hideToast } = useToastStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {children}

      {toast ? (
        <Pressable
          style={[
            styles.toastCard,
            { top: insets.top > 0 ? insets.top + 8 : 16 },
            toast.type === "success" && styles.toastSuccess,
            toast.type === "warning" && styles.toastWarning,
            toast.type === "info" && styles.toastInfo,
          ]}
          onPress={hideToast}
        >
          <Ionicons
            name={
              toast.type === "success"
                ? "checkmark-circle"
                : toast.type === "warning"
                  ? "alert-circle"
                  : "information-circle"
            }
            size={22}
            color={
              toast.type === "success"
                ? Colors.success
                : toast.type === "warning"
                  ? Colors.warning
                  : Colors.primary
            }
            style={styles.icon}
          />
          <Text style={styles.messageText}>{toast.message}</Text>
          <Ionicons
            name="close"
            size={16}
            color={Colors.inactive}
            style={styles.closeIcon}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toastCard: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 9999,
  },
  toastSuccess: {
    borderColor: "#bbf7d0",
    backgroundColor: "#f0fdf4",
  },
  toastWarning: {
    borderColor: "#fed7aa",
    backgroundColor: "#fff7ed",
  },
  toastInfo: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  icon: {
    marginRight: 10,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  closeIcon: {
    marginLeft: 8,
  },
});
