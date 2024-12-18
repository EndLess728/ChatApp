import { StyleSheet } from "react-native";
import { fonts } from "./fonts";

export const TextStyles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.openSan.regular,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.openSan.semiBold,
  },
  error: {
    fontSize: 14,
    fontWeight: "400",
  },
});
