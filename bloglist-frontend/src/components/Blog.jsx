import { useState } from 'react'

const Blog = ({ blog, handleLike, user, handleDelete }) => {
  const [infoVisible, setInfoVisible] = useState(false)
  const showBasic = {
    display: infoVisible ? 'none' : '', margin: '0px' }
  const showAll = { margin: '0px', marginBottom: '10px', display: infoVisible ? '' : 'none' }

  const DeleteButton = () => {
    if (blog.user.username === user.username) {
      return ( <><button onClick={() => handleDelete(blog)}>delete</button><br /></> )
    } else {
      return null
    }
  }

  return (
    <div>
      <div style={showBasic} className="showBasic">
        {blog.title} <i>by</i> {blog.author} <button onClick={() => setInfoVisible(true)}>view</button>
      </div>
      <div style={showAll} className="showAll">
        {blog.title} <i>by</i> {blog.author} <button onClick={() => setInfoVisible(false)}>hide</button><br />
        {blog.url}<br />
        {blog.likes} <button onClick={() => handleLike(blog)}>like</button><br />
        {blog.user.name}<br />
        <DeleteButton blog={blog} user={user} /><br />
      </div>
    </div>
  )}

export default Blog