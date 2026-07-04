import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";

import { ErrorBoundary } from "./src/shared/components/ErrorBoundary";
import { Colors } from "./src/shared/design-system/theme";
import { persister, queryClient } from "./src/shared/lib/query-client";

import ConsultationsScreen from "./src/modules/consultations/screens/ConsultationsScreen";
import HealthRecordsScreen from "./src/modules/health-records/screens/HealthRecordsScreen";
import CartScreen from "./src/modules/shop/screens/CartScreen";
import ShopScreen from "./src/modules/shop/screens/ShopScreen";

const Tab = createBottomTabNavigator();
const ShopStack = createNativeStackNavigator();

function ShopStackNavigator() {
  return (
    <ShopStack.Navigator screenOptions={{ headerShown: false }}>
      <ShopStack.Screen name="ShopMain" component={ShopScreen} />
      <ShopStack.Screen name="Cart" component={CartScreen} />
    </ShopStack.Navigator>
  );
}

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ErrorBoundary>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === "ShopTab") {
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
              headerShown: false,
            })}
          >
            <Tab.Screen
              name="ShopTab"
              component={ShopStackNavigator}
              options={{ title: "Shop" }}
            />
            <Tab.Screen
              name="Consultations"
              component={ConsultationsScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: Colors.textLight,
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
            <Tab.Screen
              name="Health Records"
              component={HealthRecordsScreen}
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: Colors.textLight,
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ErrorBoundary>
    </PersistQueryClientProvider>
  );
}
