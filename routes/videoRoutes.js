const express = require('express')
const router = express.Router()
const videoModel = require('../models/videoModel')
const path = require('path')



//multer
const multer = require('multer')
const { default: mongoose } = require('mongoose')
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,'../public/uploads'))
    },
    filename:(req,file,callback)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

// const upload =multer({storage})
const upload =multer({storage})

//extract thumbnail from youtube video
const extractYouTubeVideoId = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/|v\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
  

 

//add videos
router.post('/videos', upload.array('image'),async (req, res) =>{
    try{
        const {title, description, videoLink, type} = req.body;
        const admin = req.session.adminId
        

        if(!title || !description  || !videoLink || !type){
            return res.status(400).json({message:"All fields are required"})
        }   

        const videoId = extractYouTubeVideoId(videoLink)
        //youtube imageurl
        const youtubeVideoId = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

        const isAdmin = new mongoose.Types.ObjectId(admin)

        const imagePaths = req.files ? req.files.map(file => `../uploads/${file.filename}`) : [];
        
 
    
        const newVideo = new videoModel({
            title,
            description,
            image: imagePaths,
            videoLink, 
            createdBy:isAdmin,
            imageUrl:youtubeVideoId,
            type
        })

        if (req.files[0] == undefined) {          
            return res.send("image required");
          }

      

        await newVideo.save()
        res.status(201).json({message:"video added successfully", video:newVideo})
    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"}) 
        
    }
})


//get all videos
router.get('/videos' ,  async (req,res) =>{
    try{
        const {type} = req.query
        const filter = type ? {type} : {}
        const videos = await videoModel.find(filter)
        res.status(201).json(videos)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
})


//get single video by id
router.get('/videos/:id', async (req,res) =>{
    try{
        const videoId = req.params.id
        const video = await videoModel.findById(videoId)
        if(!video){
            return res.status(404).json({message:"video not found"})
        }
        res.status(201).json(video)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
})

//update video by id
router.put('/videos/:id', upload.array('image'), async (req,res) =>{
    try{
        const {id} = req.params
        const {title, description, videoLink,type} = req.body;
        const admin= req.session.adminId

        if(!title || !description  || !videoLink || !type){
            return res.status(400).json({message:"All fields are required"})
        } 
        const videoId = extractYouTubeVideoId(videoLink);
        
        //youtube imageurl
        const youtubeVideoId = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

        const isAdmin = new mongoose.Types.ObjectId(admin)

        const imagePaths = req.files ? req.files.map(file => `../uploads/${file.filename}`) : [];
        const updatedVideo = await videoModel.findByIdAndUpdate(id,
            {title,description,image:imagePaths,videoLink, createdBy:isAdmin, imageUrl:youtubeVideoId,type},
            {new:true}
        )
        if(!updatedVideo){
            return res.status(404).json({message:"Video not found"})
        }
        
        res.status(201).json({message:"video updated successfully", video:updatedVideo})

    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
})

//delete video by id
router.delete('/videos/:id', async (req,res) =>{
    try{
        const {id} = req.params
        const deleteVideo = await videoModel.findByIdAndDelete(id)
        if(!deleteVideo){
            return res.status(404).json({message:"Video not found"})
        }

        res.status(201).json({message:"video deleted successfully", video:deleteVideo})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
})

module.exports = router