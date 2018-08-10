
var mongoose= require('mongoose');

var User = mongoose.model('User',{
	email:{
		type:String,
		required:true,
		minlength:2,
		trim:true
	}
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