import { useState } from 'react'

const CreateForm = ({ createBlog, notifyWith }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    }
    try {
      createBlog(blogObject)
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
    } catch (exception) {
      notifyWith('Attempt to post the blog unsuccessful', 'error')
    }
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
                    Title:
          <input
            type="text"
            value={blogTitle}
            data-testid='blogTitle'
            name="blogTitle"
            placeholder="Write title here"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
                    Author:
          <input
            type="text"
            value={blogAuthor}
            data-testid='blogAuthor'
            name="blogAuthor"
            placeholder="Write author here"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
                    Url:
          <input
            type="text"
            value={blogUrl}
            data-testid='blogUrl'
            name="blogUrl"
            placeholder="Write URL here"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>

    </div>
  )
}

export default CreateForm