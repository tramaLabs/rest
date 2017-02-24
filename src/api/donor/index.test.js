import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Donor } from '.'

const app = () => express(routes)

let userSession, anotherSession, donor

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  donor = await Donor.create({ user })
})

test('POST /donors 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, quantity: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.quantity).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /donors 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /donors 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('PUT /donors/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${donor.id}`)
    .send({ access_token: userSession, quantity: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(donor.id)
  expect(body.quantity).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /donors/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${donor.id}`)
    .send({ access_token: anotherSession, quantity: 'test' })
  expect(status).toBe(401)
})

test('PUT /donors/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${donor.id}`)
  expect(status).toBe(401)
})

test('PUT /donors/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, quantity: 'test' })
  expect(status).toBe(404)
})

test('DELETE /donors/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${donor.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /donors/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${donor.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /donors/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${donor.id}`)
  expect(status).toBe(401)
})

test('DELETE /donors/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
