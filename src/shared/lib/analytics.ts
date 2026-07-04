import { customEvent, identifyDevice, vexo } from "vexo-analytics";

let Constants: any;
let Platform: any;
let Device: any;

if (process.env.NODE_ENV === "test") {
  Constants = { expoConfig: { version: "1.0.0" } };
  Platform = { OS: "ios" };
  Device = { modelName: "iPhone" };
} else {
  Constants = require("expo-constants").default;
  Platform = require("react-native").Platform;
  Device = require("expo-device");
}

const getEventMetadata = () => ({
  app_version: Constants.expoConfig?.version || "unknown",
  platform: Platform.OS,
  device_model: Device.modelName || "unknown",
  timestamp: new Date().toISOString(),
});

export const Analytics = {
  init: (apiKey: string) => {
    if (process.env.NODE_ENV !== "test" && apiKey) {
      vexo(apiKey);
    }
  },

  identify: (userId: string) => {
    if (process.env.NODE_ENV !== "test") {
      identifyDevice(userId);
    }
  },

  track: (eventName: string, params: object = {}) => {
    if (process.env.NODE_ENV !== "test") {
      const enrichedParams = {
        ...getEventMetadata(),
        ...params,
      };
      customEvent(eventName, enrichedParams);
    }
  },
};
