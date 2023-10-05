import { store } from "@/store/store";

export const appConfirm = (text) => {
  store.prompt.text = text;
  store.prompt.isOpen = true;

  return new Promise((resolve) => {
    store.prompt.onSuccess = () => {
      resolve(true);
    };
    store.prompt.onCancel = () => {
      resolve(false);
    };
  });
};
