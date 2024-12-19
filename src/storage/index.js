import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  encryptionKey: "chatapp@mantu",
  id: "chatapp-mantu",
});
