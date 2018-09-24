const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');



var data={
	num:12,
	flag:false
}

 var init_token = jwt.sign(data,'iiitv_123');
 console.log(init_token);

 var result = jwt.verify(init_token,'iiitv_123');
 console.log(result.iat);



// var text = "hey there";

// var hash = SHA256(text);
// var str = hash.toString();

// //console.log(`Text:${text}`);
// //console.log(`Hash:${str}`);



// var token ={
// 	data,
// 	hash:SHA256(JSON.stringify(data)+'SecretHash').toString()
// }


// token.data.num = 13;
// token.hash =SHA256(JSON.stringify(token.data)).toString();
// //console.log(token.hash);

// var resultHash = SHA256(JSON.stringify(token.data)+'SecretHash').toString();

// if(resultHash === token.hash){
// 	console.log('data verified');
// }
// else{
// 	console.log('data manipulated');
//}