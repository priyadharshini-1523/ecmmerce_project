import express from "express"
import connection from "./connection.js"
import jwt from "jsonwebtoken"
const authRouter=express.Router()
const SECRET="intern"
export default authRouter
authRouter.post("/signup",async(req,res)=>{
try{
const {username,email,phone,password,role}=req.body
const [exist]=await connection.query(
"SELECT * FROM users WHERE email=?",
[email]
)
if(exist.length>0){
return res.json({error:true,message:"Email already exists"})
}
await connection.query(
`INSERT INTO users (username,email,phone,password,role)
VALUES (?,?,?,?,?)`,
[username,email,phone,password,role]
)
return res.json({
error:false,
message:"Signup Success"
})
}
catch(err){
return res.status(500).json({
error:true,
message:err.message
})
}
})
authRouter.post("/login",async(req,res)=>{
try{
const {email,password}=req.body
const [result]=await connection.query(
"SELECT * FROM users WHERE email=?",
[email]
)
if(result.length===0){
return res.json({error:true,message:"Invalid Credentials"})
}
const user=result[0]
if(user.password!==password){
return res.json({error:true,message:"Invalid Credentials"})
}
const token=jwt.sign(
{userid:user.userid,role:user.role},
SECRET,
{expiresIn:"1d"}
)
return res.json({
error:false,
message:"Login Success",
token:token,
role:user.role
})
}
catch(err){
return res.status(500).json({
error:true,
message:err.message
})
}
})
export function authGuard(req,res,next){
try{
const authHeader=req.headers.authorization
if(!authHeader){
return res.status(401).json({
error:true,
message:"Token Missing"
})
}
const token=authHeader.split(" ")[1]
const decoded=jwt.verify(token,SECRET)
req.user=decoded
next()
}
catch(err){
return res.status(403).json({
error:true,
message:"Invalid Token"
})
}
}