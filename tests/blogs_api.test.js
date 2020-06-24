const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.blogs
    .map(b => new Blog(b))
  const promiseArray = blogObjects.map(b => b.save())
  await Promise.all(promiseArray)
})

test('all blogs are returned and are in correct form: JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(helper.blogs.length)
})

test('returned blogs have id as a field parameter', async() => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('a new blog is added successfully', async() => {
  const newBlog = {
    title: 'New Blog',
    author: 'Test',
    url: 'https://xxx.com/',
    likes: 710,
  }
  const newUser = {
    name: 'Niklas',
    username: 'dromastyh',
    password: 'abscd',
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  let token = 'bearer '
  await api
    .post('/api/login')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then(response => {
      token += response.body.token
    })
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const newBlogs = await helper.getBlogsInDb()
  expect(newBlogs.length).toBe(helper.blogs.length + 1)
})

test('addition of a blog with missing token returs status code 401', async() => {
  const newBlog = {
    _id: '5a422ba71b54a676436d17fb',
    title: 'New Blog',
    author: 'Test',
    url: 'https://xxx.com/',
    likes: 710,
    __v: 0
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('blogs likes count is defined', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    expect(blog.likes).toBeDefined()
  })
})

test('fails with status code 400 if title or url is missing', async () => {
  const newBlog = {
    _id: '5a422ba71b54a676436d17fb',
    title: 'Title',
    author: 'Test',
    likes: 710,
    __v: 0
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const newBlogs = await helper.getBlogsInDb()
  expect(newBlogs.length).toBe(helper.blogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})