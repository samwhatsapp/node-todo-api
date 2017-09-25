const request = require('supertest');
const expect = require('chai').expect;
const {ObjectId} = require('mongodb');

const app = require('./server').app;
var {Todo} = require('./models/todo');
var {user} = require('./models/user');

const todos = [{
	_id: new ObjectId(),
	text: 'Test todos 1'
},{	
	_id: new ObjectId(),
	text: 'Test todos2'
}];


beforeEach((done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);
	}).then(()=>{
		done();
	})
})

describe('SERVER',()=>{

	describe('POST /todos',()=>{

	it('should return a valid response',(done)=>{
		var text = 'Coming from test'
		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res)=>{
				// console.log(res.body)
				expect(res.body).to.be.an('object').that.has.property('text').to.be.equal(text);
			})
			.end((err,result)=>{
				if(err)
					done(err);
				Todo.find({_id: new ObjectId(JSON.parse(result.text)._id)}).then((doc)=>{
					expect(doc[0].text).to.equal(text);
				})
				done();
			});
			

	})

	it('should check for invalid request',(done)=>{
		request(app)
			.post('/todos')
			.send({text:''})
			.expect(400)
			.end(done)
	})

	})

	describe('GET /todos',()=>{
		it('should get all the todos',(done)=>{
			request(app).
				get('/todos').
				expect(200).
				expect((res)=>{
					// console.log(res.body.doc.length);
					expect(res.body.doc.length).to.be.equal(2);


				}).
				end(done);
		});


		it('get todos with the id',(done)=>{
	
			var id = undefined;
			request(app)
				.get('/todos')
				.expect(200)
				.expect((res)=>{
					id = res.body.doc[0]._id;
				})
				.end((err,result)=>{			
					var obj = JSON.parse(result.text)
					request(app)
						.get(`/todos/${id}`)
						.expect(200)
						.expect((result)=>{
							expect(obj.doc[0]).is.an('object').that.has.property('_id').to.be.equal(id);
						})
						.end(done);
				});


		});


		it('should return a 404 for invalid request',(done)=>{
			//In order to conver objectid to string use .toHexString()
			//${todos[0]._id.toHexString()}
			request(app)
				.get('/todos/123')
				.expect(404)
				.end(done);

		});

	})

	describe('DELETE /todos/:id',()=>{

		it('should delete a todo by id',(done)=>{
			request(app)
				.delete(`/todos/${todos[0]._id}`)
				.expect(200)
				.expect((res)=>{
					expect(res.body.todo).to.be.an('object').that.has.property('text').to.be.equal('Test todos 1');
				})
				.end(done);

		})
	})

	describe('PATCH /todos/:id',()=>{
		it('should update a Todo',(done)=>{
			request(app)
				.patch(`/todos/${todos[0]._id}`)
				.send({text:'Updated Text'})
				.expect(200)
				.expect((res)=>{
					expect(res.body.todo).to.be.an('object').that.has.property('text').to.be.equal('Updated Text');
				})
				.end(done);
		})


	})


})

