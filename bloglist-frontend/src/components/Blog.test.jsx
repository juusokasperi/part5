import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title but url and likes are still hidden', () => {
  const user = {
    username: 'esa',
    name: 'esa'
  }

  const blog = {
    title: 'test title',
    author: 'pantteri',
    url: 'not to be rendered',
    likes: 1337,
    user: {
      username: 'esa',
      name: 'Esa'
    }
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const element = screen.getAllByText(/test title/)
  expect(element).toBeDefined()

  const hiddenUrlElement = container.querySelector('.showAll')
  expect(hiddenUrlElement).toHaveStyle('display: none')
})

test('renders url and likes when view button is pressed', async () => {
  const user = {
    username: 'esa',
    name: 'esa'
  }

  const blog = {
    title: 'test title',
    author: 'pantteri',
    url: 'not to be rendered',
    likes: 1337,
    user: {
      username: 'esa',
      name: 'Esa'
    }
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const testUser = userEvent.setup()
  const button = screen.getByText('view')
  await testUser.click(button)

  const hiddenUrlElement = container.querySelector('.showAll')
  expect(hiddenUrlElement).not.toHaveStyle('display: none')
})

test('likeHandler is called twice when button is pressed twice', async () => {
  const user = {
    username: 'esa',
    name: 'esa'
  }

  const blog = {
    title: 'test title',
    author: 'pantteri',
    url: 'not to be rendered',
    likes: 1337,
    user: {
      username: 'esa',
      name: 'Esa'
    }
  }

  const mockHandler = vi.fn()

  const { container } = render(<Blog blog={blog} user={user} handleLike={mockHandler} />)

  const testUser = userEvent.setup()
  const button = screen.getByText('view')
  await testUser.click(button)
  const likeButton = screen.getByText('like')
  await testUser.click(likeButton)
  await testUser.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})