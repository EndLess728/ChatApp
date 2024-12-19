import { Alert } from "react-native";

export const CustomAlert = ({
  title = "",
  message = "",
  yesText = "Okay",
  cancelText = "Cancel",
  singleButton = true,
  onPressYesButton,
}) => {
  return new Promise((resolve, reject) => {
    singleButton
      ? Alert.alert(
          title,
          message,
          [{ text: yesText, onPress: () => resolve(true), style: "default" }],
          {
            cancelable: false,
          }
        )
      : Alert.alert(
          title,
          message,
          [
            {
              text: cancelText,
              onPress: () => resolve(false),
              style: "default",
            },
            {
              text: yesText,
              onPress: () =>
                onPressYesButton ? onPressYesButton() : resolve(true),
              style: "default",
            },
          ],
          { cancelable: false }
        );
  });
};
