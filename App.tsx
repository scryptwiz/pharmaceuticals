import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./src/shared/components/ErrorBoundary";
import ToastProvider from "./src/shared/components/ToastProvider";
import { Colors } from "./src/shared/design-system/theme";
import { Analytics } from "./src/shared/lib/analytics";
import { persister, queryClient } from "./src/shared/lib/query-client";
import { syncManager } from "./src/shared/lib/sync-manager";

import ConsultationsScreen from "./src/modules/consultations/screens/ConsultationsScreen";
import DoctorDetailScreen from "./src/modules/consultations/screens/DoctorDetailScreen";
import HealthRecordsScreen from "./src/modules/health-records/screens/HealthRecordsScreen";
import CartScreen from "./src/modules/shop/screens/CartScreen";
import ShopScreen from "./src/modules/shop/screens/ShopScreen";

const Tab = createBottomTabNavigator();
const ShopStack = createNativeStackNavigator();
const ConsultationsStack = createNativeStackNavigator();

function ShopStackNavigator() {
  return (
    <ShopStack.Navigator screenOptions={{ headerShown: false }}>
      <ShopStack.Screen name="ShopMain" component={ShopScreen} />
      <ShopStack.Screen name="Cart" component={CartScreen} />
    </ShopStack.Navigator>
  );
}

function ConsultationsStackNavigator() {
  return (
    <ConsultationsStack.Navigator screenOptions={{ headerShown: false }}>
      <ConsultationsStack.Screen
        name="ConsultationsMain"
        component={ConsultationsScreen}
      />
      <ConsultationsStack.Screen
        name="DoctorDetail"
        component={DoctorDetailScreen}
      />
    </ConsultationsStack.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    Analytics.init("c7c72032-9b93-4d43-bc9e-e72f65a94acb");
    const unsubscribe = syncManager.init();
    return unsubscribe;
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ErrorBoundary>
        <SafeAreaProvider>
          <ToastProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === "ShopTab") {
                      iconName = "cart";
                    } else if (route.name === "ConsultationsTab") {
                      iconName = "medical";
                    } else {
                      iconName = "document-text";
                    }

                    return (
                      <Ionicons name={iconName} size={size} color={color} />
                    );
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
                  name="ConsultationsTab"
                  component={ConsultationsStackNavigator}
                  options={{ title: "Consultations" }}
                />
                <Tab.Screen
                  name="Health Records"
                  component={HealthRecordsScreen}
                  options={{ title: "Health Records" }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </ToastProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </PersistQueryClientProvider>
  );
}
