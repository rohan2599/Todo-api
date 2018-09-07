const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo.js');
const {ObjectId} =  require('mongodb');
const {User} = require('./../server/models/Users.js');


// Todo.remove({}).then((result)=>{
// 	console.log(result);
// },(e)=>console.log(e));





Todo.findByIdAndRemove('5b8448e6ccdd0d1fe444f688').then((todo)=>{
	console.log('Deleted Todo',todo);
},(e)=>console.log(e));





















// var id = '5b8448e6ccdd0d1fe444f68711';
// var id_new ='5b8448e6ccdd0d1fe444f688';
// var user_id ='5b6da8b551e1252b445dcd57';

// if(!ObjectId.isValid(id)){
// 	console.log('Id not valid');
// }

// // Todo.find({
// 	_id:id
// }).then((todos)=>{
// 	console.log('Todos',todos);
// });



// Todo.findOne({
// 	_id:id
// }).then((todo)=>{
// 	console.log('Todo',todo);
// });




// Todo.findById( id_new).then((todo)=>{

// 	if(!todo){
// 		console.log('Id not found');
// 	}
// 	console.log('Todo by id',todo);
// }).catch((e)=>console.log(e));

// User.findById(user_id).then((user)=>{
// 	if(!user){
// 		 console.log('user not found');
// 	}
// 	console.log(JSON.stringify(user,undefined,2));
// },(e)=>{
// 	console.log(e);
// });

