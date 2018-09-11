const expect = require('expect');
const request = require('supertest');
const{ObjectId} = require('mongodb');
  
const {app}= require('./../server.js');
const {Todo} = require('./../models/Todo.js');

const todos =[
{text:"Its show time",
	_id: new ObjectId()
},
{ text:"Hey everybody",
_id: new ObjectId()
}];


beforeEach((done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);

	}).then(()=>done());

});

describe('POST /todos',()=>{
		it('should create the new todo',(done)=>{
			var text = 'GAME OF THRONES';

			request(app)
			.post('/todos')
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
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.length).toBe(2);
		})
		.end(done);

	});
})



describe('GET /todos/:id',()=>{
	it('should return the todo of the id',(done)=>{
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo.text).toBe(todos[0].text)
		})
		.end(done);

	});

	it('should return 404 if todo not found',(done)=>{
		var hexId = new ObjectId().toHexString();

		request(app)
		.get(`/todos/${hexId}`)
		.expect(404)
		.end(done);
	});

	it('should return 404 if there are non-object ids found',(done)=>{

		request(app)
		.get('/todos/abv23')
		.expect(404)
		.end(done);

	})
}) ;



describe('DELETE /todos',()=>{

	it('should remove a todo',(done)=>{
		var hexId = todos[1]._id.toHexString();
		request(app)
		.delete(`/todos/${hexId`)
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

	it('should return 404 if todo not found',(done)=>{
		var hexId = new ObjectId().toHexString();

		request(app)
		.delete(`/todos/${hexId}`)
		.expect(404)
		.end(done);


	});

	it('should return 404 if there  is non-object id found',(done)=>{
		request(app)
		.delete('/todos/abv23')
		.expect(404)
		.end(done);


	});
});



Describe('PATCH /todos/:id',()=>{

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