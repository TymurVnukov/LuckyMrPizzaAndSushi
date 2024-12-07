import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

import authRoutes from "./routes/auth.route.js"
import menuRoutes from "./routes/menu.route.js"

const app = express()

const PORT = process.env.PORT || 22903

app.use(cors({ origin: "http://localhost:44903", credentials: true }))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/", menuRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
})