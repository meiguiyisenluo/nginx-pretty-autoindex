import { createRouter, createWebHistory } from "vue-router";

import { web_endpoint } from "../../RouterConfig.json";

const routes = [];

const router = createRouter({
  history: createWebHistory(web_endpoint),
  routes,
});

export default router;
