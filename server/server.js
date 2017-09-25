const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const mongoose = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());


//Post
app.post('/todos',(req,res)=>{
	new Todo({
		text: req.body.text
	}).save().then((doc)=>{
		res.send(doc);
	},(err)=>{
		res.status(400).send(err);
	});
});

//Get By Id
app.get('/todos/:id',(req,res)=>{
	var id = req.params.id;
	if(!ObjectId.isValid(id)){
		return res.status(404).send('Invalid Object Id');
	}
	Todo.findById(id).then((todo)=>{
	
		if(!todo){
			return res.status(404).send('No record found');
		}
		res.send({todo});
		
		
	}),(err)=>{
		res.status(400).send(err);
	};
})

//Get
app.get('/todos',(req,res)=>{
	Todo.find().then((doc)=>{
		res.send({doc})
	});
	
})

app.listen(3000,()=>{
	console.log('Listening to port 3000...');
})


module.exports = {app}



