import { createRouter, createWebHashHistory } from "vue-router";
import Auth from "../pages/auth/Auth";
import Reg from "../pages/reg/Reg";
import MentorPage from "../pages/mentor-page/MentorPage";
import EditAttends from "../pages/editAttends/EditAttends";

export const routes = {
  auth: {
    path: "/auth",
    component: Auth,
  },
  reg: {
    path: "/reg",
    component: Reg,
  },
  main: {
    path: "/",
    redirect: () => {
      return { path: "/reg" };
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
