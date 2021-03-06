const expect = require('expect');
const request = require('supertest');
const{ObjectId} = require('mongodb');
  
const {app}= require('./../server.js');
const {Todo} = require('./../models/Todo.js');
const {todos,Users,populateTodos,populateUsers}= require('./seed/seed');
const {User} =require('./../models/Users')

beforeEach(populateUsers);
beforeEach(populateTodos);





describe('POST /todos',()=>{
		it('should create the new todo',(done)=>{
			var text = 'GAME OF THRONES';

			request(app)
			.post('/todos')
			.set('x-auth',Users[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((res)=>{
				expect(res.body.text).toBe(text);
			})
			.end((err,res)=>{

				if(err){
					return done(err);
				}

				Todo.find({text}).then((todos)=>{
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e)=>
					done(e));
			});

		});


		it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth',Users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});



describe('GET /todos',()=>{

	it('should get all todos' ,(done)=>{

		request(app).
		get('/todos')
		.set('x-auth',Users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.length).toBe(1);
		})
		.end(done);

	});
})



describe('GET /todos/:id',()=>{
	it('should return the todo of the id',(done)=>{
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.set('x-auth',Users[0].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo.text).toBe(todos[0].text)
		})
		.end(done);

	});

	it('should not return the todo created by other user',(done)=>{
		request(app)
		.get(`/todos/${todos[1]._id.toHexString()}`)
		.set('x-auth',Users[0].tokens[0].token)
		.expect(404)
		.end(done);

	});


	it('should return 404 if todo not found',(done)=>{
		var hexId = new ObjectId().toHexString();

		request(app)
		.get(`/todos/${hexId}`)
		.set('x-auth',Users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('should return 404 if there are non-object ids found',(done)=>{

		request(app)
		.get('/todos/abv23')
		.set('x-auth',Users[0].tokens[0].token)
		.expect(404)
		.end(done);

	})
}) ;



describe('DELETE /todos',()=>{

	it('should remove a todo',(done)=>{
		var hexId = todos[1]._id.toHexString();
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth',Users[1].tokens[0].token)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo._id).toBe(hexId);
		})
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			else{
				Todo.findById(hexId).then((todo)=>{
					expect(todo).toNotExist();
					done();
				}).catch((e)=>done(e));
			}
		});

	});
		it('should not remove a todo created by other user',(done)=>{
		var hexId = todos[1]._id.toHexString();
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth',Users[0].tokens[0].token)
		.expect(404)
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			else{
				Todo.findById(hexId).then((todo)=>{
					expect(todo).toExist();
					done();
				}).catch((e)=>done(e));
			}
		});

	});

	it('should return 404 if todo not found',(done)=>{
		var hexId = new ObjectId().toHexString();

		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth',Users[1].tokens[0].token)
		.expect(404)
		.end(done);


	});

	it('should return 404 if there  is non-object id found',(done)=>{
		request(app)
		.delete('/todos/abv23')
		.set('x-auth',Users[1].tokens[0].token)
		.expect(404)
		.end(done);


	});
});



describe('PATCH /todos/:id',()=>{

	it('should update the todo',(done)=>{
		var hexId = todos[0]._id.toHexString();
		var text = "The updated todo";
		request(app)
		.patch(`/todos/${hexId}`)
		.expect(200)
		.send({
			flag:true,
			text
		})
		.expect((res)=>{
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(res.body.todo.completedAt).toBeA(number);
		})
		.end(done);

	});



	it('should clear completedAt when todo is not updated',(done)=>{
			var hexId = todos[1]._id.toHexString();
		var text = "The updated todo!!!!!";
		request(app)
		.patch(`/todos/${hexId}`)
		.expect(200)
		.send({
			flag:false,
			text
		})
		.expect((res)=>{
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toNotExist();

		})
		.end(done);


	});
});


describe('GET /users/me',(done)=>{
	it('should return a user if authenticated',(done)=>{

			request(app)
			.get(`/users/me`)
			.set('x-auth',Users[0].tokens[0].token)
			.expect(200)
			.expect((res)=>{
				expect(res.body._id).toBe(Users[0]._id.toHexString());
				expect(res.body.email).toBe(Users[0].email);
			})
			.end(done);

	});

	it('should return a 401 if not authenticated',(done)=>{

			request(app)
			.get(`/users/me`)
			.expect(401)
			.exepect((res)=>{
				expect(res.body).toEqual({});

			})
			.end(done);
	});
});


describe('POST /users',(done)=>{

	it('should return a user if email valid',(done)=>{
		var email = 'asdfgh@gmail.com';
		var password= 'ewsfsd1';

		request(app)
		.post('/users')
		.send({email,password})
		.expect(200)
		.expect((res)=>{
			expect(res.headers['x-auth']).toExist();
			expect(res.body._id).toExist();
			expect(res.body.email).toBe(email)

		}).end((err)=>{
			if(err){
				return done(err);
			}

			User.findOne({email}).then((user)=>{
				expect(user).toExist();
				expect(user.password).toNotBe(password);
				done();
			})
		});
	});
	it('should return validation errors on invalid emails',(done)=>{
		request(app)
		.post('/users')
		.send({
			email:'anfpognjeg',
			password:'wqe'
		})
		.expect(400)
		.end(done);
	});
	it('should not create user if email is in use',(done)=>{
		request(app)
		.post('/users')
		.send({
			email:'Users[0].email',
			password:'iiitvb133'
		})
		.expect(400)
		.end(done);
	});


});


describe('POST /users/login',(done)=>{

	it('should login the user'(done)=>{
		request(app)
		.post('/users/login')
		.send({
			email:Users[1].email,
			password:Users[1].password
		})
		.expect(200)
		.expect((res)=>{
			expect(res.headers['x-auth']).toExist();

		})
		.end((err)=>{
			if(err){
				return done(err);
			}
			User.findById(Users[1]._id).then((user)=>{
				expect(Users.tokens[0]).toInclude({
					access:'x-auth',
					token:res.headers['x-auth']
				})
				done();
			}).catch((e)=>done(e));
		})
	});


	it('should reject invalid login',(done)=>{
		request(app)
		.post('/users/login')
		.send({
			email:Users[1].email,
			password:Users[1].password+'23'
		})
		.expect(400)
		.expect((res)=>{
			expect(res.headers['x-auth']).toNotExist();
		})
		.end((err,res)=>{
			if(err){
				return done(err);
			}

			Users.findById(Users[1]._id).then((user)=>{
				expect(Users.tokens.lenght).toBe(0);
			})
			done();

		}).catch((e)=>done(e));
	})
});

describe('DELETE /users/me/token',()=>{
	it('should logged out  the user ',(done)=>{
		request(app)
		.delete('/users/me/token')
		.set('x-auth',Users[0].tokens[0].token)
		.expect(200)
		.end((err,res)=>{
			if(err){
				done(err);
			}

			User.findById(User[0]._id).then((user)=>{
				expect(Users[0].tokens.length).toBe(0);
			})
			done();
		}).catch((e)=>done(e));
	})
})