import { onRequestDelete as __api_products_js_onRequestDelete } from "C:\\WEB\\perfume website\\functions\\api\\products.js"
import { onRequestGet as __api_products_js_onRequestGet } from "C:\\WEB\\perfume website\\functions\\api\\products.js"
import { onRequestPost as __api_products_js_onRequestPost } from "C:\\WEB\\perfume website\\functions\\api\\products.js"
import { onRequestPut as __api_products_js_onRequestPut } from "C:\\WEB\\perfume website\\functions\\api\\products.js"

export const routes = [
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