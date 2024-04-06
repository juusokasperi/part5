import { render, screen } from '@testing-library/react'
import CreateForm from './CreateForm'
import userEvent from '@testing-library/user-event'

test('<CreateForm /> calls updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()

  render(<CreateForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('Write title here')
  const inputAuthor = screen.getByPlaceholderText('Write author here')
  const inputUrl = screen.getByPlaceholderText('Write URL here')
  const sendButton = screen.getByText('Submit')

  await userEvent.type(inputTitle, 'test title')
  await userEvent.type(inputAuthor, 'test author')
  await userEvent.type(inputUrl, 'test url')

  await userEvent.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('test url')
})