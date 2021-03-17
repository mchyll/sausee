import { Platform } from "react-native";

export const MAX_ZOOM = Platform.OS === "ios" ? 16.3 : 16.99;
