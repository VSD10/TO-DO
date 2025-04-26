const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Hello World!');
})
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoapp',)
.then(()=>{
    console.log('connected to MongoDB')
})
.catch((err)=>{
    console.log(err);
})

// Define a schema for the todo items
const todoSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})
  
// Create a model for the todo items
const todoModel=mongoose.model('Todo',todoSchema);
app.post('/todos',async(req,res)=>{
    const {title,description}=req.body;
    try{
        const todo=new todoModel({title,description});
        await todo.save();
        res.status(201).json(todo)
    }
    catch(err){
        console.log(err);
    }
   
})




// Get all todo items
app.get('/todos',async(req,res)=>{
    try {
        const todos=await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
        
    }
})

// Update a todo item
app.put('/todos/:id',async(req,res)=>{
try{
    const {title,description}=req.body;
    const id=req.params.id;
    const updatedtodo=await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
    )
    if(!updatedtodo){
        return res.status(404).json({message:'Todo not Found'})
    }
    res.json(updatedtodo);
}
    catch(err){
        console.log(err);
        res.status(500).json({message:error.message});
   } });

// Delete a todo item
app.delete('/todos/:id',async(req,res)=>
{
    try{

        const id=req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }  catch(err){
        console.log(err);
        res.status(500).json({message:error.message});
   }
})



const port=8000;
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});