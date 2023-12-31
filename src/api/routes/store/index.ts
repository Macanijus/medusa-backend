import cors from "cors"
import { Router } from "express"
import bodyParser from "body-parser"
import customRouteHandler from "./custom-route-handler"
import { wrapHandler } from "@medusajs/medusa";

const storeRouter = Router()
export function getStoreRouter(storeCorsOptions): Router {
  storeRouter.use("/store", cors(storeCorsOptions), bodyParser.json())

  storeRouter.post(
    "/my-custom-path",
    wrapHandler(customRouteHandler)
  )

  return storeRouter
}
