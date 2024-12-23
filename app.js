import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './src/routes/user.routes'
import mongoose from 'mongoose'

dotenv.config()
const app = express

app.use(express.json())
app.use('/api/users',userRoutes)
mongoose.connect(process.env.MONGO)

app.listen(process.env.PORT, ()=> console.log('server in port: 8080 ' + process.env.PORT))