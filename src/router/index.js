import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import CreateBlogPage from "@/views/CreateBlogPage.vue";
import FullBlogPage from "@/views/FullBlogPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import NotFound from "@/views/NotFound.vue";
import NetworkIssue from "@/views/NetworkIssue.vue";
import { logged } from "@/assets/isLogged";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/profile/:id",
      name: "profile",
      component: ProfilePage,
      props: true,
    },
    {
      path: "/blogs/:id",
      name: "full-blog",
      component: FullBlogPage,
      props: true,
    },
    {
      path: "/create-blog",
      name: "create-blog",
      component: CreateBlogPage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
    },
    {
      path: "/404",
      name: "404",
      component: NotFound,
    },
    {
      path: "/network-issue",
      name: "network-issue",
      component: NetworkIssue,
    },
    { path: "/:pathMatch(.*)*", name: "404", component: NotFound },
    { path: "/:pathMatch(.*)", name: "404", component: NotFound },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (
    !logged() &&
    to.name !== "login" &&
    to.name !== "register" &&
    to.name !== "network-issue" &&
    to.name !== "home" &&
    to.name !== "full-blog"
  ) {
    next({ name: "login" });
  } else {
    next();
  }
});
export default router;
