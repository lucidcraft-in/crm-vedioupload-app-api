const mongoose = require('mongoose')


async function connectDB(){
    try{
        await mongoose.connect('mongodb+srv://aneespengad:aneespengad@cluster0.dbru6.mongodb.net/')
    console.log("Database connected successfully");
    }catch(error){
        console.log(error)
    }
    
}

module.exports = connectDB;