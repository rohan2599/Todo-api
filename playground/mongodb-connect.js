//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectId} = require('mongodb');

// var user = {name:'rohan',age:25};
// var {name} = user;
// console.log(name);


var obj = new ObjectId();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err,db)=>{
	if(err){
	return console.log('unable to connect');
	}
  
	console.log('connected successfully');

	db.collection('todos').insertOne({
		id: 123,
		text:'hey'
		


	},(err,result)=>{
		if(err){
			console.log('cannot insert data');
		}

		console.log(result.ops);
		//console.log(result.ops[0]._id.getTimestamp()); 


	});


	db.close();
})