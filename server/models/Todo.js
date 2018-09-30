
var mongoose = require('mongoose');
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
		},

		_creator:{
			type:mongoose.Schema.Types.ObjectId,
			required:true
		}
		
	

});
module.exports={Todo};
//  var newTodo = new Todo({
//  	text:'got'
//  });


//   newTodo.save().then((doc)=>{
//  	console.log(doc);
//  },(e)=>{
// 	console.log('unable to save data');
// });


// var otherTodo = new Todo({
// 	text:'  rohan   '
// });

// otherTodo.save().then((doc)=>{
// 	console.log(doc);

// },(e)=>{
// 	console.log('unable to save data');
// });