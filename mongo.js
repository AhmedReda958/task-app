const {ObjectId,MongoClient}=require("mongodb")


const dataUrl="mongodb://127.0.0.1:27017"
const databaseName='task-manager'

MongoClient.connect(dataUrl, {useNewUrlParser:true ,useUnifiedTopology: true,useFindAndModify:false},(error,client)=>{

    if (error) {
        console.log("error");
    }

    const db =client.db(databaseName)

    db.collection('tasks').updateMany({
        state:"true"
    },{
       $set:{ 
           state:true
    }        
    }).then((res)=>{
        console.log(res);
    }).catch((error)=>console.log(error))
    

})