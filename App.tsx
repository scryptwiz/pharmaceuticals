import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

import ConsultationsScreen from "./src/modules/consultations/screens/ConsultationsScreen";
import HealthRecordsScreen from "./src/modules/health-records/screens/HealthRecordsScreen";
import ShopScreen from "./src/modules/shop/screens/ShopScreen";
import { Colors } from "./src/shared/design-system/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === "Shop") {
              iconName = "cart";
            } else if (route.name === "Consultations") {
              iconName = "medical";
            } else {
              iconName = "document-text";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.inactive,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textLight,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      >
        <Tab.Screen name="Shop" component={ShopScreen} />
        <Tab.Screen name="Consultations" component={ConsultationsScreen} />
        <Tab.Screen name="Health Records" component={HealthRecordsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
