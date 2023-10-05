import { store } from "@/store/store";

export const appAlert = (text) => {
  store.alert.text = text;
  store.alert.isOpen = true;
};
