import { createRouter, createWebHashHistory } from "vue-router";
import Auth from "../pages/auth/Auth";
import MentorPage from "../pages/mentor-page/MentorPage";
import EditAttends from "../pages/editAttends/EditAttends";
import AdminPage from "@/pages/adminPage/AdminPage.vue";
import AdminAuth from "@/pages/adminAuth/AdminAuth.vue";
import Reg from "@/pages/reg/Reg.vue";

export const routes = {
  auth: {
    path: "/auth",
    component: Auth,
  },
  adminPanelAuth: {
    path: "/admin-auth",
    component: AdminAuth,
  },
  adminPage: {
    path: "/admin-page",
    component: AdminPage
  },
  reg: {
    path: "/reg",
    component: Reg,
  },
  main: {
    path: "/",
    redirect: () => {
      return { path: "/auth" };
    },
  },
  tutorPage: {
    path: "/mentor-page",
    component: MentorPage,
  },
  editAttends: {
    path: "/edit-attends",
    component: EditAttends,
  },
};

const routerHistory = createWebHashHistory();

const router = createRouter({
  history: routerHistory,
  routes: Array.from(Object.values(routes)),
});

export default router;
