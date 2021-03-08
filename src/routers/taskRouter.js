const express =require('express')
const Task =require("../modoles/task")
const router = express.Router()
const auth =require('../middleware/auth')

//add task
router.post("/tasks", auth ,async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(404).send()
    }
})

// get user tasks
// router.get("/tasks",auth , async (req,res)=>{
//      try {
//          await req.user.populate('tasks').execPopulate()
//         //  const tasks = await Task.find({owner:req.user._id})
//          res.send(req.user.tasks) 
//      } catch (e) {
//          res.status(500).send()
//      }
// })
router.get('/tasks', auth, async (req, res) => {
    
    const match ={}
    const sort ={}

    if (req.query.completed) {
        match.state = req.query.completed === "true"
    }
    if(req.query.sortBy){
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1] === "desc"? -1:1
    }
    try {

        await req.user.execPopulate({
            path:'tasks',
            match ,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})
// fetch one task by id
router.get("/tasks/:id", auth , async (req,res)=>{
    const _id =req.params.id
    
    try {
        const task = await Task.findOne({_id , owner: req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
         res.status(500).send()
    }
})

//update task 
router.patch("/tasks/:id",auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowed = ["state","discribe"]
    const isAllowed = updates.every(update=> allowed.includes(update))

    if (!isAllowed) {
        res.status(400).send({"error":"Invalid update!"})
    }
    try {
        const _id =req.params.id
        const task = await Task.findOne({_id ,  owner: req.user._id })        
        if (!task) {
            res.status(404).send()
        }
        updates.forEach(update => task[update]= req.body[update]);
        task.save()
        res.send(task)
    } catch (e) {
        res.send(500)
    }
})

//del user
router.delete("/tasks/:id" ,auth , async (req,res)=>{
    try {
        const _id =req.params.id
        const task = await Task.findOne({_id ,  owner: req.user._id })    

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {   
        res.status(500).send()
    }
})

module.exports =router