import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { showMenu, showMenuItem, checkout, myorders } from '../controllers/menu.controller.js'

const router = express.Router()

router.get("/menu/:categoryName", showMenu)

router.get("/menu/item/:itemName", showMenuItem)

router.post("/checkout", verifyToken, checkout)

router.get("/myorders", verifyToken, myorders)

export default router