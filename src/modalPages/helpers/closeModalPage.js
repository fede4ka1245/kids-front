import { store } from "@/store/store";

export const closeModalPage = () => {
  store.modalPages.activePage = "";
  store.modalPages.props = undefined;
  store.modalPages.isModalOpen = false;
};
