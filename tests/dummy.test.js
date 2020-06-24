const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    const result = listHelper.dummy(helper.blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('totalLikes returns total number of likes', () => {
    const result = listHelper.totalLikes(helper.blogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog likes', () => {
  test('favouriteBlog returns highest voted blog', () => {
    const result = listHelper.favouriteBlog(helper.blogs)
    expect(result).toEqual(helper.blogs[2])
  })
})

describe('most blogs', () => {
  test('mostBlogs returns author with most blogs', () => {
    const result = listHelper.mostBlogs(helper.blogs)
    expect(result).toEqual(
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    )
  })
})

describe('most likes', () => {
  test('mostLikes returns author with most likes', () => {
    const result = listHelper.mostLikes(helper.blogs)
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
    )
  })
})