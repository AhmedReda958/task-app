const express = require("express")
const User = require("../modoles/user")
const Task = require("../modoles/task")
const multer =require("multer")
const auth =require("../middleware/auth")
const sharp = require("sharp")
const { welcomeMail , deleteMail} = require("../emails/account")


const router = express.Router()
// add new user
router.post("/users/sign", async (req,res)=>{

    const user= new User(req.body)
    try {
        const token = await user.genrateTokens()
        welcomeMail(user.email , user.name)
       await user.save()
       res.status(201).send({user , token })


    } catch (e) {
        res.status(400).send(e)
    }

})


// login 
router.post('/users/login' ,async (req, res) => {
    try {
        const user = await User.findByEmail(req.body.email , req.body.pass)
        const token = await user.genrateTokens()

        res.send({user , token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// logout
router.post("/users/logout", auth , async (req,res)=>{

    try {
        
        req.user.tokens = req.user.tokens.filter(token=>{
            return token.token !== req.token
            
        })
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()
    }
})

// logout all user antil me 
router.post('/users/logoutall' , auth ,async (req,res)=> {

    try {
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()

    }
})

//read profile
router.get("/users/me", auth, async (req,res)=>{
        res.send(req.user)
    
})




// Update user
router.patch("/user/me", auth ,async (req, res)=>{
    const updates= Object.keys(req.body)
    const allowed = ["name","pass","email","age"]
    const isAllowed = updates.every(update=> allowed.includes(update) )
    
    if (!isAllowed) {
        res.status(400).send({"error":"Invalid updates!"})
    }
    
    try {
        
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
    
})

router.delete("/users/me", auth , async (req,res)=>{
    
    try {
        await Task.deleteMany({owner: req.user._id})
        await req.user.remove()
        deleteMail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
        
    }
})
// upload user avatar
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file, cb){
       if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
           return cb( new Error("this file is not valid"))
       }
       cb(undefined ,true)
    }
})

router.post("/user/me/avatar",auth , upload.single("avatar"),async (req, res)=>{
    const Buffer = await sharp(req.file.buffer).resize({height:250,width:250
}).png().toBuffer()
     req.user.avatar =Buffer
    await req.user.save()
    res.send()
},(e,req ,res,next)=>{
    res.status(400).send({ error : e.message})
})
// del avatar
router.delete('/user/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// render avatar
router.get("/user/:id/avatar", async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set("Content-Type", "image/png")
        res.send(user.avatar)
        
    } catch (e) {
        res.status(404).send()
    }
})

module.exports= router