//const MongoClient = require('mongodb').MongoClient;
//ES6-destructuring
//This file update documents of a doc
const {MongoClient,ObjectId} = require('mongodb');


var obj = new ObjectId();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err,db)=>{
	if(err){
	return console.log('unable to connect');
	}
  
	console.log('connected successfully');
//updating a doc using set operator in findOneAnd Update
	db.collection('todos').findOneAndUpdate({_id: new ObjectId('5b6d61cb2f127f2b4d5ad175')},{
	 	$set:{
	 		text:'why'
 		}},{
	 	returnOriginal : false}).then((reply)=>{
	 		console.log(reply);
	 	},(err)=>{
	 		console.log('unable to update elements')
	 	});


//updating a doc using mul and inc operator 
	db.collection('todos').findOneAndUpdate({_id : new ObjectId('5b6d61cb2f127f2b4d5ad175')},{
	$inc:{
		id:25
		}
	},{  returnOriginal: false
		}).then((reply)=>{
			console.log(reply);
		},(err)=>{
			console.log('unable to increment the id');
		});

	db.close();
})