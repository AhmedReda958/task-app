const mongoose =require('mongoose')

mongoose.connect(process.env.TASK_MANAGER,{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

