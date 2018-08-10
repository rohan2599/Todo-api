var express = require('express');
var bodyParser = require('body-parser');  


var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {User} =  require('./models/Users.js');


var app =express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
	var todo = new Todo({
		text:req.body.text
	});

	todo.save().then((doc)=>{
		(res.send(doc);
	},(err)=>{
		res.status(200).send(err);
	})
});


app.listen(3000,()=>{
	console.log('Started on port 3000');

});
















