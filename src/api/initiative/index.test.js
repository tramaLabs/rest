import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Initiative } from '.'

const app = () => express(routes)

let user, anotherUser, admin, userSession, anotherSession, adminSession, initiative

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  admin = await User.create({ role: 'admin', email: 'c@c.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  initiative = await Initiative.create({ user, users: [user], title: 'foo' })
})

test('POST /initiatives 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, title: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(Array.isArray(body.users)).toBe(true)
  expect(body.users.length).toBe(1)
  expect(body.users[0]).toEqual(user.view())
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
  expect(body.length).toBe(1)
})

test('GET /initiatives?user=anotherUserId 200', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ user: anotherUser.id })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBe(0)
})

test('GET /initiatives/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${initiative.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(initiative.id)
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
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(initiative.id)
  expect(body.title).toEqual('test')
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

test('PUT /initiatives/:id/users 200 (user) - add user', async () => {
  const user1 = await User.create({ email: 'd@d.com', password: '123456' })
  const { status, body } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: userSession, add: user1.id })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(initiative.id)
  expect(Array.isArray(body.users)).toBe(true)
  expect(body.users.length).toBe(2)
  expect(body.users[1]).toEqual(user1.view())
})

test('PUT /initiatives/:id/users 200 (user) - add users', async () => {
  const [ user1, user2 ] = await User.create([
    { email: 'd@d.com', password: '123456' },
    { email: 'e@e.com', password: '123456' }
  ])
  const { status, body } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: userSession, add: [user1.id, user2.id] })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(initiative.id)
  expect(Array.isArray(body.users)).toBe(true)
  expect(body.users.length).toBe(3)
  expect(body.users[1]).toEqual(user1.view())
  expect(body.users[2]).toEqual(user2.view())
})

test('PUT /initiatives/:id/users 200 (user) - another user adds himself', async () => {
  const { status, body } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: anotherSession, add: anotherUser.id })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(initiative.id)
  expect(Array.isArray(body.users)).toBe(true)
  expect(body.users.length).toBe(2)
  expect(body.users[1]).toEqual(anotherUser.view())
})

test('PUT /initiatives/:id/users 401 (user) - another user adds user', async () => {
  const user1 = await User.create({ email: 'd@d.com', password: '123456' })
  const { status } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: anotherSession, add: user1.id })
  expect(status).toBe(401)
})

test('PUT /initiatives/:id/users 401 (user) - another user adds users', async () => {
  const user1 = await User.create({ email: 'd@d.com', password: '123456' })
  const { status } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: anotherSession, add: [anotherUser.id, user1.id] })
  expect(status).toBe(401)
})

test('PUT /initiatives/:id/users 401 - add user', async () => {
  const user1 = await User.create({ email: 'd@d.com', password: '123456' })
  const { status } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ add: user1.id })
  expect(status).toBe(401)
})

test('PUT /initiatives/:id/users 200 (user) - remove user', async () => {
  const user1 = await User.create({ email: 'd@d.com', password: '123456' })
  initiative.users.addToSet(user1)
  await initiative.save()
  const { status, body } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: userSession, remove: user1.id })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(initiative.id)
  expect(Array.isArray(body.users)).toBe(true)
  expect(body.users.length).toBe(1)
  expect(body.users[0]).toEqual(user.view())
})

test('PUT /initiatives/:id/users 200 (user) - remove users', async () => {
  const [ user1, user2 ] = await User.create([
    { email: 'd@d.com', password: '123456' },
    { email: 'e@e.com', password: '123456' }
  ])
  initiative.users.addToSet(user1, user2)
  await initiative.save()
  const { status, body } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: userSession, remove: [user1.id, user2.id] })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(initiative.id)
  expect(Array.isArray(body.users)).toBe(true)
  expect(body.users.length).toBe(1)
  expect(body.users[0]).toEqual(user.view())
})

test('PUT /initiatives/:id/users 200 (user) - another user removes himself', async () => {
  initiative.users.addToSet(anotherUser)
  await initiative.save()
  const { status, body } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: anotherSession, remove: anotherUser.id })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(initiative.id)
  expect(Array.isArray(body.users)).toBe(true)
  expect(body.users.length).toBe(1)
  expect(body.users[0]).toEqual(user.view())
})

test('PUT /initiatives/:id/users 401 (user) - another user removes user', async () => {
  const user1 = await User.create({ email: 'd@d.com', password: '123456' })
  initiative.users.addToSet(user1)
  await initiative.save()
  const { status } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: anotherSession, remove: user1.id })
  expect(status).toBe(401)
})

test('PUT /initiatives/:id/users 401 (user) - another user removes users', async () => {
  const user1 = await User.create({ email: 'd@d.com', password: '123456' })
  initiative.users.addToSet(anotherUser, user1)
  await initiative.save()
  const { status } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ access_token: anotherSession, remove: [anotherUser.id, user1.id] })
  expect(status).toBe(401)
})

test('PUT /initiatives/:id/users 401 - remove user', async () => {
  const user1 = await User.create({ email: 'd@d.com', password: '123456' })
  initiative.users.addToSet(user1)
  await initiative.save()
  const { status } = await request(app())
    .put(`/${initiative.id}/users`)
    .send({ remove: user1.id })
  expect(status).toBe(401)
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
