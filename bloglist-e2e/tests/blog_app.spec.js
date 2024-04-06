const { test, expect } = require('@playwright/test');
const { loginWith, createBlog, likeBlog } = require ('./helper');
const { json } = require('stream/consumers');

test.only('5.23 - blogs are in order of likes', async ( { page, request }) => {
  await request.post('/api/testing/reset')
  
  await request.post('/api/users', {
    data: {
      name: 'Test User',
      username: 'test',
      password: 'test'
    }
  })

  const mockBlogs = [
    {
      author: 'Test Author 1',
      title: 'Test Blog 1',
      url: 'Test Url 1',
      user: '333fdf',
      id: '556',
      likes: 5
    },
    {
      author: 'Test Author 2',
      title: 'Test Blog 2',
      url: 'Test Url 2',
      user: '333fdf',
      id: '55612',
      likes: 0
    },
    {
      author: 'Test Author 3',
      title: 'Test Blog 3',
      url: 'Test Url',
      user: '333fdf',
      id: '556123',
      likes: 2
    }
  ]
  
  await page.route('/api/blogs', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockBlogs)
    })
  })
  await page.goto('/')
  await loginWith(page, 'test', 'test')
  await expect(page.locator('.showBasic').first()).toContainText('Test Blog 1')
  await expect(page.locator('.showBasic').nth(1)).toContainText('Test Blog 3')
  await expect(page.locator('.showBasic').nth(2)).toContainText('Test Blog 2')
})

test.describe('When logged in', () => {
  test.beforeEach(async ({ page, request }) => {
    // Reset DB, create new user & log in
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'test',
        password: 'test'
      }
    })
    await page.goto('/')
    await loginWith(page, 'test', 'test')
  })
  test('5.19 - a new blog can be created', async ({ page }) => {
    await createBlog(page, 'Test Blog', 'Test Author', 'Test Url')
    await expect(page.getByText('New Blog Test Blog by Test Author added succesfully!')).toBeVisible()
  })
  test('5.20 - a blog can be liked', async ({ page }) => {
    await createBlog(page, 'Test Blog', 'Test Author', 'Test Url')
    await page.getByText('Test Blog').getByRole('button', { name: 'view' }).click()
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('1 like')).toBeVisible()
  })
  test('5.21 - a blog can be removed', async({ page }) => {
    await createBlog(page, 'Test Blog', 'Test Author', 'Test Url')
    await page.getByText('Test Blog').getByRole('button', { name: 'view' }).click()
    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'delete' }).click()
    await expect(page.getByText('Test Blog by Test Author deleted')).toBeVisible()
    await expect(page.getByText('Test Blog by Test Author hide')).not.toBeVisible()
    await expect(page.getByText('Test Blog by Test Author view')).not.toBeVisible()
  })
  test('5.22 - user cannot delete posts by other users', async ({ page, request }) => {
    await createBlog(page, 'Test Blog', 'Test Author', 'Test Url')
    await page.getByRole('button', { name: 'Log out' }).click()
    
    //Create new user and log in
    await request.post('/api/users', {
      data: {
        name: 'Test User 2',
        username: 'test2',
        password: 'test2'
      }
    })
    await loginWith(page, 'test2', 'test2')

    await page.getByText('Test Blog').getByRole('button', { name: 'view' }).click()
    await expect(page.getByText('delete')).not.toBeVisible()
  })
/*  test('5.23 - blogs are in order of likes', async ({ page }) => {
    await createBlog(page, 'Test Blog', 'Test Author', 'Test Url')
    await createBlog(page, 'Test Blog 2', 'Test Author 2', 'Test Url 2')
    await createBlog(page, 'Test Blog 3', 'Test Author 3', 'Test Url 3')
    await likeBlog(page, 'Test Blog 2', 'Test Author')
    page.pause()
    await page.getByText('Test Blog 3').getByRole('button', { name: 'view' }).click()
    await page.getByRole('button', { name: 'like' }).click()
    await page.getByText('1 like').nth(1).waitFor()
    await page.getByRole('button', { name: 'like' }).click()
    await page.getByRole('button', { name: 'hide' }).click()
    await expect(page.locator('.showBasic').first()).toContainText('Test Blog 3')
    await expect(page.locator('.showBasic').nth(1)).toContainText('Test Blog 2')
  })*/
})
test.describe('Login view', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'test',
        password: 'test'
      }
    })

    await page.goto('/')
  })

  test('5.17 - login form is shown', async ({ page }) => {
    await expect(page.getByText('Login')).toBeVisible()
  })

  test('5.18 - login fails with incorrect credentials', async ({ page }) => {
    await loginWith(page, 'test', 'incorrect')

    await expect(page.getByText('Invalid username or password.')).toBeVisible()
    await expect(page.getByText('Test User logged in')).not.toBeVisible()

  })

  test('5.18 - login succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'test', 'test')

    await expect(page.getByText('Test User logged in')).toBeVisible()
  })
})