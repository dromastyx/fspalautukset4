const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user: 0 })
  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const users = await User.find({})

  if (users.map(u => u.username).includes(body.username)) {
    return response.status(400).send({ error: 'username must be unique' })
  } else if (!body.password || !body.username) {
    return response.status(400).send({ error: 'password or username missing' })
  } else if (body.password.length < 3 || body.username.length < 3) {
    return response.status(400).send({ error: 'password or username should be at least 3 characters' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.json(savedUser)
  }

})

module.exports = usersRouter