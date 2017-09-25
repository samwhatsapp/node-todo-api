require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');

const mongoose = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


const port = process.env.PORT || 3000 ;

const app = express();

app.use(bodyParser.json());


//Post (create a todo)
app.post('/todos',(req,res)=>{
	new Todo({
		text: req.body.text
	}).save().then((doc)=>{
		res.send(doc);
	},(err)=>{
		res.status(400).send(err);
	});
});

//Get All
app.get('/todos',(req,res)=>{
	Todo.find().then((doc)=>{
		res.send({doc})
	});
	
})

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

//Delete By id 
app.delete('/todos/:id',(req,res)=>{
	var id = req.params.id;
	if(!ObjectId.isValid(id)){
		return res.status(404).send('Invalid Object Id');
	}

	Todo.findByIdAndRemove(id).then((todo)=>{
		if(!todo){
			return res.status(404).send('No record found');
		}

		res.send({todo});

	},(err)=>{
		res.status(400).send(err);

	});


})

//Update a todo by id
app.patch('/todos/:id',(req,res)=>{
	var id = req.params.id;
	var body = _.pick(req.body,['text','completed']);



	if(!ObjectId.isValid(id)){
		return res.status(404).send('Invalid Object Id');
	}
	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	} else{
		body.completed = false;
		body.completed = null;
	}

	Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
		if(!todo){
			return res.status(404).send('No record found');
		}
		return res.send({todo})
	}).catch((err)=>{
		res.status(400).send(err);
	})

})





app.listen(port,()=>{
	console.log(`Listening to port ${port}...`);
})


module.exports = {app}



