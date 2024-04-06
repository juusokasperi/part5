import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [info, setInfo] = useState({ message: null })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const createFormRef = useRef()

  useEffect(() => {
    getBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const getBlogs = async () => {
    const initialBlogs = await blogService.getAll()
    const sortedBlogs = initialBlogs.sort((blog1, blog2) => blog2.likes - blog1.likes)
    setBlogs(sortedBlogs)
  }

  const addBlog = async (blogObject) => {
    const response = await blogService.create(blogObject)
    notifyWith(`New blog ${blogObject.title} by ${blogObject.author} added succesfully!`)
    getBlogs()
    createFormRef.current.toggleVisibility()
  }

  const addLike = async (blog) => {
    await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    getBlogs()
  }

  const deleteBlog = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      notifyWith(`${blog.title} by ${blog.author} deleted`)
      await blogService.remove(blog.id)
      getBlogs()
    }
  }

  const logOutButton = () => {
    const user = null
    setUser(user)
    window.localStorage.removeItem('loggedBlogappUser')
    console.log('logged out')
  }

  const notifyWith = (message, type = 'info') => {
    setInfo({ message, type })
    setTimeout(() => {
      setInfo({ message: null })
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      notifyWith(`Logged in as ${user.name}`)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith('Invalid username or password.', 'error')
    }
  }

  return (
    <div>
      <Notification info={info} />

      {!user && <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword} />}
      {user && <div>
        <p>{user.name} logged in <button onClick={logOutButton}>Log out</button></p>
        <BlogForm blogs={blogs} handleLike={addLike} user={user} handleDelete={deleteBlog} />
        <Togglable buttonLabel='Create blog' ref={createFormRef}>
          <CreateForm
            createBlog={addBlog}
            notifyWith={notifyWith}
            info={info}
            setInfo={setInfo}
          />
        </Togglable>
      </div>
      }
    </div>
  )
}

export default App