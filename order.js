import express from "express"
import connection from "./connection.js"
import { authGuard } from "./auth.js"
const orderRouter = express.Router()
export default orderRouter
orderRouter.post("/buy",authGuard,async (req, res) => {
    try {
        const {
            pid,
            amount,
            payment_method,
            quantity,
            address
        } = req.body
        console.log(req.body)
        if(!pid ||!amount ||!payment_method ||!quantity ||!address)
        {
            return res.json({
                error:true,
                message:"All Fields Required"
            })
        }
       await connection.query(`INSERT INTO orders(userid,pid,amount,payment_method,quantity,address,status)VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.userid,
                pid,
                amount,
                payment_method,
                quantity,
                address,
                "Confirmed"
            ]
        )
        return res.json({
            error:false,
            message:"Order Placed Successfully"
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error:true,
            message:"Order Failed"
        })
    }
})
orderRouter.get("/",authGuard,async (req,res)=>{
    try {
        console.log(req.user)
        const [data] =
        await connection.query(`SELECT o.*,p.name FROM orders o JOIN product p ON o.pid = p.pid WHERE o.userid = ?`,
            [req.user.userid]
        )
        console.log(data)
        return res.json({
            error:false,
            data
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            error:true,
            message:"Order Failed"
        })
    }
})