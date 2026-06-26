import { onRequestPost as __api_admin_login_js_onRequestPost } from "C:\\WEB\\perfume website\\functions\\api\\admin\\login.js"
import { onRequestPost as __api_auth_login_js_onRequestPost } from "C:\\WEB\\perfume website\\functions\\api\\auth\\login.js"
import { onRequestGet as __api_auth_me_js_onRequestGet } from "C:\\WEB\\perfume website\\functions\\api\\auth\\me.js"
import { onRequestPost as __api_auth_signup_js_onRequestPost } from "C:\\WEB\\perfume website\\functions\\api\\auth\\signup.js"
import { onRequestGet as __api_inventory_low_stock_js_onRequestGet } from "C:\\WEB\\perfume website\\functions\\api\\inventory\\low-stock.js"
import { onRequestPut as __api_orders_status_js_onRequestPut } from "C:\\WEB\\perfume website\\functions\\api\\orders\\status.js"
import { onRequestPost as __api_promotions_apply_js_onRequestPost } from "C:\\WEB\\perfume website\\functions\\api\\promotions\\apply.js"
import { onRequestGet as __api_customers_index_js_onRequestGet } from "C:\\WEB\\perfume website\\functions\\api\\customers\\index.js"
import { onRequestDelete as __api_products_js_onRequestDelete } from "C:\\WEB\\perfume website\\functions\\api\\products.js"
import { onRequestGet as __api_products_js_onRequestGet } from "C:\\WEB\\perfume website\\functions\\api\\products.js"
import { onRequestPost as __api_products_js_onRequestPost } from "C:\\WEB\\perfume website\\functions\\api\\products.js"
import { onRequestPut as __api_products_js_onRequestPut } from "C:\\WEB\\perfume website\\functions\\api\\products.js"

export const routes = [
    {
      routePath: "/api/admin/login",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_login_js_onRequestPost],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_js_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_js_onRequestGet],
    },
  {
      routePath: "/api/auth/signup",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_signup_js_onRequestPost],
    },
  {
      routePath: "/api/inventory/low-stock",
      mountPath: "/api/inventory",
      method: "GET",
      middlewares: [],
      modules: [__api_inventory_low_stock_js_onRequestGet],
    },
  {
      routePath: "/api/orders/status",
      mountPath: "/api/orders",
      method: "PUT",
      middlewares: [],
      modules: [__api_orders_status_js_onRequestPut],
    },
  {
      routePath: "/api/promotions/apply",
      mountPath: "/api/promotions",
      method: "POST",
      middlewares: [],
      modules: [__api_promotions_apply_js_onRequestPost],
    },
  {
      routePath: "/api/customers",
      mountPath: "/api/customers",
      method: "GET",
      middlewares: [],
      modules: [__api_customers_index_js_onRequestGet],
    },
  {
      routePath: "/api/products",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_products_js_onRequestDelete],
    },
  {
      routePath: "/api/products",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_products_js_onRequestGet],
    },
  {
      routePath: "/api/products",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_products_js_onRequestPost],
    },
  {
      routePath: "/api/products",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_products_js_onRequestPut],
    },
  ]