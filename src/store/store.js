import { reactive } from "vue";
import { modalPages } from "./stores/modalPages";
import { createClient } from '@supabase/supabase-js'

export const store = reactive({
  modalPages: modalPages,
  alert: {
    isOpen: false,
    text: "",
  },
  user: {
    data: {},
    isAuth: false
  },
  attends: [],
  loading: false,
  supabase: createClient(process.env.VUE_APP_SUPABASE_URL, process.env.VUE_APP_SUPABASE_KEY),
  prompt: {
    isOpen: false,
    text: "",
    onSuccess: () => {},
    onCancel: () => {},
  },
});
