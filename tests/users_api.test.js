const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const userObjects = helper.users
    .map(u => new User(u))
  const promiseArray = userObjects.map(u => u.save())
  await Promise.all(promiseArray)
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  }
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('username must be unique')

})

test('username is at least 3 characters long', async () => {
  const newUser = {
    username: 'ro',
    name: 'Superuser',
    password: 'salainen',
  }
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('password or username should be at least')

})

test('password is at least 3 characters long', async () => {
  const newUser = {
    username: 'root2',
    name: 'Superuser',
    password: 'sa',
  }
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('password or username should be at least')

})

afterAll(() => {
  mongoose.connection.close()
})