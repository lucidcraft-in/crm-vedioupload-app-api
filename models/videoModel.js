const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:Array
    },
    videoLink:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admin',
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
    }
},
{timestamps:true}
)

const videoModel = mongoose.model('videoTutuorials', videoSchema)
module.exports = videoModel