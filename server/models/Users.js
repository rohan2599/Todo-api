
var mongoose= require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var userSchema = new mongoose.Schema({
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

userSchema.methods .toJSON = function(){

	var user = this;
	var userObject =  user.toObject();

	return _.pick(userObject,['_id','email']);


}

userSchema.methods.generateAuthToken = function(){
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id:user._id.toHexString(),access},'iiitv_123').toString();

	user.tokens.push({access,token});
	return user.save().then(()=>{
		return token;
	})
}

userSchema.statics.findByToken = function(token){

	var User = this;
	var decoded;

	try{
			decoded = jwt.verify(token,'iiitv_123');

	}catch(e){
		return new Promise((resolve,reject)=>{
			reject();
		})
	}

	return User.findOne({
		'_id':decoded._id,
		'tokens.token':token,
		'tokens.access':'auth'
	});

};

userSchema.pre('save', function(next){
	var user = this;

	if(user.isModified('password')){

		bcrypt.genSalt(10,salt,(err,salt)=>{
			bcrypt.hash(user.password,salt,(err,hash)=>{
					user.password=hash;
					next();
			})
		});
	}
	else{
		next();
	}
});

var User = mongoose.model('User',userSchema);

module.exports={User};

// var newUser = new User({
// 	email:' rohan123@gmail.com '
// });

// newUser.save().then((doc)=>{

// 	console.log(doc);
// },(e)=>{
// 	console.log('path email is required');
// });