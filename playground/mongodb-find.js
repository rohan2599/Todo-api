//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');





MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err,db)=>{
	if(err){
	return console.log('unable to connect');
	}
  
	console.log('connected successfully');

// 	db.collection('todos').find({
// 		_id: new ObjectID('5b65723aa9676c19d47f6bd1')
// 	}).toArray().then((doc)=>{
// 		console.log('todos');
// 		console.log(JSON.stringify(doc,undefined,2));
// 	},
// 	(err)=>{
// 			console.log('unable to fetch data',err);
// 		}
// );


	db.collection('todos').find().count().then((count)=>{
		console.log('todos count:',count);
		
	},
	(err)=>{
			console.log('unable to fetch data',err);
		}
);

	


//	db.close();
})