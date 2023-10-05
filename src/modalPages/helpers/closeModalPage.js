import { store } from "@/store/store";

export const closeModalPage = (isCancel = false) => {
  store.modalPages.activePage = "";
  store.modalPages.props = undefined;
  store.modalPages.isModalOpen = false;

  if (isCancel && store.modalPages.onCancel) {
    store.modalPages.onCancel();
  }
};
