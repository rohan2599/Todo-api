  
 //validating datatypes of mongoose model

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ToDoApp');
//Todo model 
var Todo = mongoose.model( 'Todo',{
	text : {
		type:String,
		required:true,
		minlength:1,
		trim: true
	},
		id:{
			type:Number,
			default : null
		},

		flag:{
			type: Boolean,
			default : false
		}
		
	
});

 var newTodo = new Todo({
 	text:'got'
 });


  newTodo.save().then((doc)=>{
 	console.log(doc);
 },(e)=>{
	console.log('unable to save data');
});


var otherTodo = new Todo({
	text:'  rohan   '
});

otherTodo.save().then((doc)=>{
	console.log(doc);

},(e)=>{
	console.log('unable to save data');
});

//new model of user created
var User = mongoose.model('User',{
	email:{
		type:String,
		required:true,
		minlength:2,
		trim:true
	}
});

var newUser = new User({
	email:' rohan123@gmail.com '
});

newUser.save().then((doc)=>{

	console.log(doc);
},(e)=>{
	console.log('path email is required');
});
















