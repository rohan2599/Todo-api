
require('./config/config.js');

var express = require('express');
var bodyParser = require('body-parser');  
var {ObjectId} = require('mongodb');
var  _ = require('lodash');  


var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {User} =  require('./models/Users.js');
var {authenticate} =require('./middleware/authenticate');


var app =express();
const port = process.env.PORT||3000;

app.use(bodyParser.json());

app.post('/todos',authenticate,(req,res)=>{
	var todo = new Todo({
		text:req.body.text,
		_creator:req.user._id
	}); 

	todo.save().then((doc)=>{
		res.send(doc);
	},(err)=>{
		res.status(400).send(err);
	})
});

app.get('/todos',authenticate,(req,res)=>{

	Todo.find({
		_creator:req.user._id
	}).then((todos)=>{
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



app.get('/todos/:id',authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
  	_id:id,
  	_creator:req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});



app.delete('/todos/:id',authenticate,(req,res)=>{
	var id = req.params.id;
	if(!ObjectId.isValid(id)){
		return res.status(404).send();

	}
	Todo.findOneAndRemove({
		_id:id,
		_creator:req.user._id
	}).then((result)=>{
			if(!result){
				return res.status(404).send();
			}
			res.send({todo: todo});
	}).catch((e)=>{
		res.status(400).send();
	});
});


app.patch('/todos/:id',authenticate,(req,res)=>{
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
Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((todo)=>{
	if(!todo){
		return res.status(404).send();
	}

	res.send({todo});
}).catch((e)=>{ res.status(400).send()})

});



app.post('/users',(req,res)=>{
	var body = _.pick(req.body,['email','password']);
	var user = new User(body);


	
	user.save().then((user)=>{
		//res.send(user);
		return user.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth',token).send(user);

	}).catch((e)=>{
		  res.status(400).send(e);
	})


});

app.post('/users/login',(req,res)=>{

	var body = _.pick(req.body,['email','password']);
	

	User.findByCredentials(body.email,body.password).then((user)=>{
		return user.generateAuthToken().then((token)=>{
			res.header('x-auth',token).send(user);
		})
	}).catch((e)=>{
		res.status(400).send();
	})
});

app.get('/users/me',authenticate,(req,res)=>{

	res.send(req.user);

}); 

app.delete('/users/me/token',authenticate,(req,res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	},()=>{
		res.status(400).send();
	})
});

/*
	{
		{
	email:asd
	pass:wad}
	}
*/
app.listen(	port,()=>{
	console.log(`started on port ${port}`);
  
});


module.exports={app};














