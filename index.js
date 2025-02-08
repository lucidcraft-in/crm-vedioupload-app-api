const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const connectDB = require('./database')
const videoRoute = require('./routes/videoRoutes')
const userRoute = require('./routes/loginRoutes')
const port = 5000
const session = require('express-session')
require('dotenv').config()


connectDB()
 
app.use(cors({
    // origin: "https://resonant-gecko-5bc789.netlify.app",
    origin:'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//use express sesion
app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized:true,
    resave:false,
    cookie:{
        maxAge: 24 * 24 * 60 * 1000,
        httpOnly:true
    }
}))


app.use(express.static(path.join(__dirname,'public')))



app.use('/api', userRoute)
app.use('/api', videoRoute)

app.listen(port, () =>{
    console.log(`Port running on ${port}`);
})
