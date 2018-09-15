
var mongoose= require('mongoose');
var validator = require('validator');

var User = mongoose.model('User',{
	email:{
		type:String,
		required:true,
		minlength:2,
		trim:true,
		unique:true,
		validate:{
			validator: validator.isEmail,
			message:'{VALUE} is not a valid email'
		}

	},
	password:{
		type:String,
		required:true,
		minlength:6
	},
	tokens:[{
		access:{
			type:String,
			required:true
		},
		token:{
			type:String,
			required:true
		}
	}]
});

module.exports={User};

// var newUser = new User({
// 	email:' rohan123@gmail.com '
// });

// newUser.save().then((doc)=>{

// 	console.log(doc);
// },(e)=>{
// 	console.log('path email is required');
// });