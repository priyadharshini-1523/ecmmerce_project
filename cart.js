import express from "express"
import connection from "./connection.js"
import { authGuard } from "./auth.js"
const cartRouter=express.Router()
export default cartRouter
cartRouter.get("/add/:pid",authGuard,async(req,res)=>{
try{
await connection.query(
`INSERT INTO cart(userid,pid) VALUES (?,?)`,
[req.user.userid,req.params.pid]
)
res.json({
error:false,
message:"Added to Cart"
})
}
catch(err){
console.log(err)
res.json({
error:true,
message:"Cart Failed"
})
}
})
cartRouter.get("/view",authGuard,async(req,res)=>{
try{
const [data]=await connection.query(
`SELECT p.* 
FROM cart c
JOIN product p ON c.pid=p.pid
WHERE c.userid=?`,
[req.user.userid]
)
res.json({
error:false,
data
})
}
catch(err){
console.log(err)
res.json({
error:true,
message:"Cart Load Failed"
})
}
})
cartRouter.delete("/remove/:pid",authGuard,async(req,res)=>{
try{
await connection.query(
`DELETE FROM cart 
WHERE userid=? AND pid=?`,
[req.user.userid,req.params.pid]
)
res.json({
error:false,
message:"Removed from Cart"
})
}
catch(err){
console.log(err)
res.json({
error:true,
message:"Remove Failed"
})
}
})