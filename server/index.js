import express from 'express'
import connectDb from './db/connectdb.js'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const port = process.env.PORT || 8000
const DATABASE_URL = "mongodb://localhost:27017"
import auth from './routes/auth.js'
import chat from './routes/chat.js'
import message from './routes/message.js'
app.use(cors())
app.use(express.json())

app.use("/user",auth)
app.use('/chat',chat)
app.use('/message',message)

connectDb(DATABASE_URL)
app.listen(port, (req,res)=> {
    console.log(`request send ${port}`)
})