import {store} from "@/store/store";
import moment from "moment";

export const getCurrentAttends = (groupId, organizationId) => {
  return store.supabase
    .from("Attend")
    .select("*")
    .eq("groupId", groupId)
    .eq("organizationId", organizationId)
}
