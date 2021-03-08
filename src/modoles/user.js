const mongoose =require('mongoose')
const validator =require('validator')
const bcrypt = require("bcrypt")
const jwt =require("jsonwebtoken")

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)) {
                console.log('this mail dose not valid!');
            }
        }
    },pass:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if (value.includes("password")) {
                throw new Error("password dosn't valid!");
            }
        }
    },
    age:{
        type:Number,
        validate(value){
            if (value<0) {
                throw new Error("age mustn't be negative value")
            }
        }
    },avatar:{
        type:Buffer
        
    },tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})
userSchema.virtual('tasks',{
    ref:'Task',
    localField:"_id",
    foreignField:"owner"
})

// hid data 
userSchema.methods.toJSON = function () {
    const user = this
    const toObject = user.toObject()

    delete toObject.pass
    delete toObject.tokens

    return toObject
}
//genrate tokens 
userSchema.methods.genrateTokens = async function () {
    const user = this
    const token =jwt.sign({_id:user._id.toString()},process.env.JWT_WORD)

    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
    
}


// login
userSchema.statics.findByEmail = async (email,pass) => {
    const user= await User.findOne({ email })

    if (!user) {
        throw new Error("this email is never exist");
    }

    const isMatch = await bcrypt.compare(pass , user.pass)

    if (!isMatch) {
        throw new Error("wrong password!")
    }
    return user
}

// hash password before saveing
userSchema.pre("save",async function (next) {
    const user =this 
    if (user.isModified("pass")) {
        user.pass = await bcrypt.hash(user.pass,8)
        
    }
    next()
}  )

const User =mongoose.model("User",userSchema)

module.exports =User