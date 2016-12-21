import path from 'path'
import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Initiative } from '.'

const app = () => express(routes)
const attachment = path.join(__dirname, '../../../test/tramalogo.jpg')

let user, anotherUser, admin, userSession, anotherSession, adminSession, initiative

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  admin = await User.create({ role: 'admin', email: 'c@c.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  initiative = await Initiative.create({ user, title: 'foo' })
})

test('POST /initiatives 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, title: 'Test title' })
  expect(status).toBe(201)
  expect(typeof body).toBe('object')
  expect(body.title).toBe('Test title')
  expect(body.slug).toBe('test-title')
  expect(Array.isArray(body.users)).toBe(true)
  expect(body.users).toHaveLength(1)
})

test('POST /initiatives 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /initiatives 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /initiatives?user=userId 200', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ user: user.id })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body).toHaveLength(1)
})

test('GET /initiatives?users=userId 200', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ users: user.id })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body).toHaveLength(1)
})

test('GET /initiatives?user=anotherUserId 200', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ user: anotherUser.id })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body).toHaveLength(0)
})

test('GET /initiatives?users=anotherUserId 200', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ users: anotherUser.id })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body).toHaveLength(0)
})

test('GET /initiatives/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${initiative.id}`)
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(initiative.id)
})

test('GET /initiatives/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /initiatives/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${initiative.id}`)
    .send({ access_token: userSession, title: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(initiative.id)
  expect(body.title).toBe('test')
})

test('PUT /initiatives/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${initiative.id}`)
    .send({ access_token: anotherSession, title: 'test' })
  expect(status).toBe(401)
})

test('PUT /initiatives/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${initiative.id}`)
  expect(status).toBe(401)
})

test('PUT /initiatives/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, title: 'test' })
  expect(status).toBe(404)
})

test('PUT /initiatives/:id/join 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${initiative.id}/join`)
    .send({ access_token: anotherSession })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(initiative.id)
  expect(body.users).toHaveLength(2)
  expect(body.users[0].id).toBe(anotherUser.id)
})

test('PUT /initiatives/:id/join 401', async () => {
  const { status } = await request(app())
    .put(`/${initiative.id}/join`)
  expect(status).toBe(401)
})

test('PUT /initiatives/:id/join 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456/join')
    .send({ access_token: anotherSession })
  expect(status).toBe(404)
})

test('PUT /initiatives/:id/leave 200 (user)', async () => {
  initiative.users.addToSet(anotherUser)
  await initiative.save()
  expect(initiative.users).toHaveLength(2)
  const { status, body } = await request(app())
    .put(`/${initiative.id}/leave`)
    .send({ access_token: anotherSession })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(initiative.id)
  expect(body.users).toHaveLength(1)
})

test('PUT /initiatives/:id/leave 401', async () => {
  const { status } = await request(app())
    .put(`/${initiative.id}/leave`)
  expect(status).toBe(401)
})

test('PUT /initiatives/:id/leave 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456/leave')
    .send({ access_token: anotherSession })
  expect(status).toBe(404)
})

jest.mock('../../services/image', () => ({
  read () {
    return Promise.resolve({
      getPredominantColorHex: jest.fn(() => '#1e1e1d'),
      clone: jest.fn().mockReturnThis(),
      quality: jest.fn().mockReturnThis(),
      scaleToFit: jest.fn().mockReturnThis(),
      getBuffer () {
        return Promise.resolve()
      }
    })
  }
}))

jest.mock('../../services/s3', () => ({
  upload: () => Promise.resolve('test.jpg'),
  remove: () => Promise.resolve()
}))

test('PUT /initiatives/:id/photo 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${initiative.id}/photo`)
    .query({ access_token: userSession })
    .attach('data', attachment)
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.id).toBe(initiative.id)
  expect(body.color).toBe('#1e1e1d')
  expect(body.photo).toEqual({
    small: 'test.jpg',
    medium: 'test.jpg',
    large: 'test.jpg'
  })
})

test('PUT /initiatives/:id/photo 401 (user) - anotherUser', async () => {
  const { status } = await request(app())
    .put(`/${initiative.id}/photo`)
    .query({ access_token: anotherSession })
    .attach('data', attachment)
  expect(status).toBe(401)
})

test('PUT /initiatives/:id/photo 401', async () => {
  const { status } = await request(app())
    .put(`/${initiative.id}/photo`)
    .attach('data', attachment)
  expect(status).toBe(401)
})

test('PUT /initiatives/:id/photo 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456/photo')
    .query({ access_token: userSession })
    .attach('data', attachment)
  expect(status).toBe(404)
})

test('DELETE /initiatives/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${initiative.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /initiatives/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${initiative.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /initiatives/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${initiative.id}`)
  expect(status).toBe(401)
})

test('DELETE /initiatives/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
