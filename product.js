import express from "express"
import connection from "./connection.js"
import { authGuard } from "./auth.js"
const productRouter=express.Router()
export default productRouter
productRouter.post("/add",authGuard,async(req,res)=>{
try{
const {name,price,detail,category}=req.body
if(req.user.role!=="vendor"){
return res.json({
error:true,
message:"Only Vendor Can Add Product"
})
}
if(!name||!price||!detail||!category){
return res.json({
error:true,
message:"All Fields Required"
})
}
await connection.query(`INSERT INTO product(name,price,detail,category,uploaded_by,is_active)VALUES (?,?,?,?,?,?)`,[name,parseFloat(price),
detail,category,req.user.userid,1])
return res.json({
error:false,
message:"Product Added Successfully"
})
}
catch(err){
console.log("ADD PRODUCT ERROR:",err.sqlMessage||err.message)
return res.status(500).json({
error:true,
message:"Add Product Failed"
})
}
})

productRouter.get("/",authGuard,async(req,res)=>{
try{
const [data]=await connection.query(`SELECT * FROM product WHERE is_active=1`)
return res.json({
error:false,
data
})
}
catch(err){
console.log("FETCH ERROR:",err.message)
return res.status(500).json({
error:true,
message:"Fetch Failed"
})
}
})
productRouter.get("/myproducts",authGuard,async(req,res)=>{
try{
const [data]=await connection.query(`SELECT * FROM product WHERE uploaded_by=? AND is_active=1`,
[req.user.userid])
return res.json({
error:false,
data
})
}
catch(err){
console.log("MY PRODUCT ERROR:",err.message)
return res.status(500).json({
error:true,
message:"Product Load Failed"
})
}
})
productRouter.put("/edit/:pid",authGuard,async(req,res)=>{
try{
const {name,price,detail,category}=req.body
if(!name||!price||!detail||!category){
return res.json({
error:true,
message:"All Fields Required"
})
}
await connection.query(`UPDATE product SET name=?,price=?,detail=?,category=? WHERE pid=? AND uploaded_by=?`,
[name,parseFloat(price),detail,category,req.params.pid,req.user.userid])
return res.json({
error:false,
message:"Product Updated Successfully"
})
}
catch(err){
console.log("UPDATE ERROR:",err.message)
return res.status(500).json({
error:true,
message:"Update Failed"
})
}
})
productRouter.delete("/:pid",authGuard,async(req,res)=>{
try{
await connection.query(`UPDATE product SET is_active=0 WHERE pid=?`,[req.params.pid])
return res.json({
error:false,
message:"Product Deleted Successfully"
})
}
catch(err){
console.log("DELETE ERROR:",err.message)
return res.status(500).json({
error:true,
message:"Delete Failed"
})
}
})