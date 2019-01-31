
const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/Todo.js');
const {User} =require('./../../models/User.js');
const jwt = require('jsonwebtoken');


const UserOneId = new ObjectId();
const UserTwoId = new ObjectId();
const Users= [{
	_id : UserOneId
	email:'rohan123@gmail.com',
	password :'sdfposg',
	tokens:[
		{
			access:'auth',
			token:jwt.verify({_id:UserOneId,access:'auth'},process.env.JWT_SECRET).toString()
		}
	]

},{
		_id : UserOneId
	email:'rohan1235@gmail.com',
	password :'sdfpw4reosg',
	tokens:[
		{
			access:'auth',
			token:jwt.verify({_id:UserTwoId,access:'auth'},process.env.JWT_SECRET).toString()
		}
	]


}];

const todos =[
{text:"Its show time",
	_id: new ObjectId(),
	_creator:UserOneId
},
{ text:"Hey everybody",
_id: new ObjectId(),
_creator:UserTwoId
}];

const populateTodos =(done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);

	}).then(()=>done());

};


const populateUser = (done)=>{
	User.remove({}).then(()=>{
			var userOne = new User(Users[0]).save();
			var userTwo = new User(Users[1]).save();
			return Promise.All([userOne,userTwo]);
	}).then(()=>done());
}


module.exports={	todos,populateTodos,populateUser,Users
};