const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// let todos = [];

mongoose.connect(process.env.URI)

.then(() => {console.log('DB Connected')}
)
.catch((error) => {console.log(error)}
)

// creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    }
});

// creating model
const todoModel = mongoose.model('Todo', todoSchema)

app.post('/todos',async (req, res) => {
    const {title, description} = req.body;
    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
});

app.get('/todos',async (req,res) => {
    try {
        const todos =await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const {title, description} = req.body;
        const {id} = req.params
        const updateTodo =await todoModel.findByIdAndUpdate( 
            id,
            {title, description},
            { new: true} //updated data
        )

        if (!updateTodo){
            return res.status(404).json({message: "Todo not found"})
        }
        res.send(updateTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
});

app.delete('todos/:id', async (req,res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

app.listen(process.env.PORT, () => console.log(`server running at http://localhost:${process.env.PORT}`));