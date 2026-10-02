import express from "express"
import cors from "cors"
import authRouter from "./auth.js"
import productRouter from "./product.js"
import cartRouter from "./cart.js"
import orderRouter from "./order.js"
const app = express()
app.use(cors())
app.use(express.json())
app.use("/auth", authRouter)
app.use("/product", productRouter)
app.use("/cart", cartRouter)
app.use("/order", orderRouter)
app.listen(3000, () => {
    console.log("Server running on port 3000")
})