//const MongoClient = require('mongodb').MongoClient;
//ES6-destructuring
const {MongoClient,ObjectId} = require('mongodb');




var obj = new ObjectId();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err,db)=>{
	if(err){
	return console.log('unable to connect');
	}
  
	console.log('connected successfully');

	


	db.close();
})