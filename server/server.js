
var express = require('express');
var bodyParser = require('body-parser');  
var {ObjectId} = require('mongodb');
var  _ = require('lodash');  


var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {User} =  require('./models/Users.js');


var app =express();
const port = process.env.PORT||3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
	var todo = new Todo({
		text:req.body.text
	}); 

	todo.save().then((doc)=>{
		res.send(doc);
	},(err)=>{
		res.status(400).send(err);
	})
});

app.get('/todos',(req,res)=>{

	Todo.find().then((todos)=>{
		res.send({todos});


	},(err)=>{
		res.status(400).send(err);
	})
})






// app.get('/todos/:id',(req,res)=>{
// 	var id = req.params.id;
// 	if(!ObejctId.isValid(id)){
// 		return res.status(404).send();
// 	}

// 	Todo.findById(id).then((todo)=>{
// 		if(!todo){
// 			return res.status(404).send();
// 		}
// 		res.status(200).send({todo});
// 	})
// },(e)=>{
// 	res.status(404).send();
// });



app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});



app.delete('/todos/:id',(req,res)=>{
	var id = req.params.id;
	if(!ObjectId.isValid(id)){
		return res.status(404).send();

	}
	Todo.findByIdAndRemove(id).then((result)=>{
			if(!result){
				return res.status(404).send();
			}
			res.send({todo: todo});
	}).catch((e)=>{
		res.status(400).send();
	});
});


app.patch('/todos/:id',(req,res)=>{
	var id = req.params.id;
	var body = _.pick(req.body,['text','flag']);
	if(!ObjectId.isValid(id)){
		return res.status(404).send();

	}
	if(_.isBoolean(body.flag) && body.flag){

		body.completedAt = new Date().getTime();

	}
	else{
			body.flag = false;
			body.completedAt=null;
	}
Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
	if(!todo){
		return res.status(404).send();
	}

	res.send({todo});
}).catch((e)=>{ res.status(400).send()})

});

app.listen(	port,()=>{
	console.log(`started on port ${port}`);
  
});


module.exports={app};














