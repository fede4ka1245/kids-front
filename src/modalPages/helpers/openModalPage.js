import { store } from "@/store/store";

export const openModalPage = (modalPageName, props) => {
  if (!props || !modalPageName) {
    return;
  }
  store.modalPages.activePageName = modalPageName;
  store.modalPages.props = props;
  store.modalPages.isModalOpen = true;

  return new Promise((resolve, reject) => {
    store.modalPages.props.onCancel = () => {
      reject();
    }

    store.modalPages.props.onSave = (data) => {
      resolve(data);
    }
  });
};
