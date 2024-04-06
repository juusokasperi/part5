import Blog from './Blog'

const BlogForm = ({ blogs, handleLike, user, handleDelete }) => {
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id} user={user} blog={blog}
          handleDelete={handleDelete} handleLike={handleLike}
        />
      )}
    </div>
  )
}

export default BlogForm