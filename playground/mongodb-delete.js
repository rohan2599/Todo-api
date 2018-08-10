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

	//deleteMany
	db.collection('todos').deleteMany({text:'heysdospgr'}).then((result)=>{
		console.log(result);
	},(err)=>{
		console.log('unable to count');
	});


	//deleteOne

	 db.collection('todos').deleteOne({text:'helo'}).then((result)=>{
	 	console.log(result);
	 }); 

	//findOneAndDelete
	db.collection('todos').findOneAndDelete({id:12344}).then((result)=>{
		console.log(result);
	})

	//findOneAndDelete By Id
	
	db.collection('todos').findOneAndDelete({_id: new ObjectId('5b6d5c5d2f127f2b4d5ad064')}).then((reply)=>{
	 	console.log(reply);
	 })


	db.close();
})