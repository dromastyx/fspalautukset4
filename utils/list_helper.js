/* eslint-disable no-unused-vars */
var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(b => b.likes).reduce((x,y) => x + y, 0)
}

const favouriteBlog = (blogs) => {
  const likes = blogs.map(b => b.likes)
  const maxInd = likes.indexOf(Math.max(...likes))
  return blogs[maxInd]
}

const mostBlogs = (blogs) => {
  const authorBlogs = _(blogs)
    .groupBy('author')
    .map((blogs, author) => ({
      'author': author,
      'blogs': blogs.length
    }))
    .value()
  return _.maxBy(authorBlogs, 'blogs')
}

const mostLikes = (blogs) => {
  const likes = _(blogs)
    .groupBy('author')
    .map((likes, author) => ({
      'author': author,
      'likes': _.sumBy(likes, 'likes')
    }))
    .value()
  return _.maxBy(likes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}