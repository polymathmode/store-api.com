import express from "express";
import dotenv from "dotenv"

dotenv.config()

const PORT=process.env.PORT || 4700


const app =express()


app.listen(PORT,()=>{
console.log(`Server is listening on port ${PORT}`)
})