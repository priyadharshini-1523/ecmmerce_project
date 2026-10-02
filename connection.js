import mysql from "mysql2/promise"
let connection = null
try
{
    connection = await mysql.createConnection(
    {
        host:"localhost",
        user:"projectdb",
        password:"priya",
        port:3306,
        database:"projectdb"
    })
    console.log("DB connection success")
}
catch(error)
{
    console.log("DB connection error =", error)
}
export default connection