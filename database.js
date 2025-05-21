const mongoose = require('mongoose')


async function connectDB(){
    try{
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.ucg6xup.mongodb.net/')
    console.log("Database connected successfully");
    }catch(error){
        console.log(error)
    }
    
}

module.exports = connectDB;