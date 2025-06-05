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

app.use(cors()); 

// app.use(cors({
//     origin: '*',
//     // origin:'http://localhost:5173',
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials:true
// }))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//use express sesion
// app.use(session({
//     secret:process.env.SESSION_SECRET || '72f8b4527c8f4a2b9f3bda11a9d55f467c2d66b36e8c9a2a5eab6c56bc8a4c3d',
//     saveUninitialized:true,
//     resave:false,
//     cookie:{
//         maxAge: 24 * 24 * 60 * 1000,
//         httpOnly:true
//     }
// }))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
 


app.use(express.static(path.join(__dirname,'public')))



app.use('/api', userRoute)
app.use('/api', videoRoute)

app.listen(port, () =>{
    console.log(`Port running on ${port}`);
})
