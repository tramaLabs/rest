import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Initiative } from '.'

const app = () => express(routes)

let userSession, anotherSession, initiative

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  initiative = await Initiative.create({ user })
})

test('POST /initiatives 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, title: 'test', photo: 'test', users: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.photo).toEqual('test')
  expect(body.users).toEqual('test')
  expect(typeof body.user).toEqual('object')
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
    .send({ access_token: userSession, title: 'test', photo: 'test', users: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(initiative.id)
  expect(body.title).toEqual('test')
  expect(body.photo).toEqual('test')
  expect(body.users).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /initiatives/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${initiative.id}`)
    .send({ access_token: anotherSession, title: 'test', photo: 'test', users: 'test' })
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
    .send({ access_token: anotherSession, title: 'test', photo: 'test', users: 'test' })
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
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
