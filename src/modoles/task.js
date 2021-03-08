const mongoose =require('mongoose')
const taskSchema = new mongoose.Schema(
    {
        discribe:{
            type:String,
            required:true,
            trim:true
        },
        state:{
            type:Boolean,
            default:false
        },
        owner:{
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:true
        }
    },{
        timestamps:true
    }
    )
const Task = mongoose.model("Task", taskSchema)
module.exports =Task
