import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import dotenv from 'dotenv'

const app = express();

dotenv.config()
console.log(process.env.PORT);

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}))

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use('/auth', authRouter) 
app.get('/', (req, res) => {
    console.log("req.body")
})

app.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});