const express = require("express")
const {MongoClient,ObjectId, ReturnDocument} = require("mongodb");
const { object } = require("webidl-conversions");
const cors=require("cors")

const app = express()
const todoRoutes = express.Router();
app.use(cors())
app.use(express.json())
app.use("/todos",todoRoutes)

// Mongo Configuration
const uri = "mongodb://127.0.0.1:27017"
const client = new MongoClient(uri)
let db;

//add todo item in db
todoRoutes.route("/add").post( async(req,res)=>{
    await db.collection("todos").insertOne(req.body);
    res.send(req.body)
});


//get todo item form db
todoRoutes.route("/").get(async (req,res)=>{
    let todos= await db.collection("todos").find({}).toArray()
    res.send(todos)
});


//get todo item by using ID

todoRoutes.route("/:id").get(async (req,res)=>{
    let id=new ObjectId(req.params.id)
    let todo= await db.collection("todos").find({_id: id}).toArray()
    res.send(todo)
})


//update todo item 
todoRoutes.route("/update/:id").put(async(req,res)=>{
    let id=new ObjectId(req.params.id);

    let todo= await db.collection("todos").findOneAndUpdate({_id:id},
        {
            $set:{
                todoName:req.body.todoName,
                todoResponsbility:req.body.todoResponsbility,
                todoPriorities:req.body.todoPriorities,
            },
        },   //it take another parameter for return document
        {
            ReturnDocument:"after"
        });
    res.send(todo);
})



//delete todos from todos
todoRoutes.route("/delete/:id").delete(async (req,res)=>{
    
    await db.collection("todos").deleteOne({_id: new ObjectId(req.params.id)})
    res.send("Todo Deleted successfully")
})







async function connectToMOngoStartServer(){
    //connecting to Mongo
    await client.connect();
    db = client.db("todoApp")   //it will create a database with name todoApp 
    console.log("mongo connection done successfully")

    //start app when connection is successful
    app.listen(3000,()=>{
        console.log("listening at port no 3000")
    })
}

connectToMOngoStartServer().then(console.log).catch(console.error);
