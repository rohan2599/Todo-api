var express = require('express');
var bodyParser = require('body-parser');  
var {ObjectId} = require('mongodb');


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






app.listen(3000,()=>{
	console.log('Started on port 3000');
  
});


module.exports={app};














