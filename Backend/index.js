import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDb.js'
import userRouter from './route/userroute.js'
import categoryRouter from './route/Categoryrout.js'
import uploadRouter from './route/uploadroute.js'
import { subcategoryRouter } from './route/subcategoryroute.js'
import { productRouter } from './route/productroute.js'

const app = express()
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT = 8080 || process.env.PORT 

app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running " + PORT
    })
})

app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subcategoryRouter)
app.use("/api/product",productRouter)
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})
