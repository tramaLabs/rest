import request from 'supertest-as-promised'
import { stub } from 'sinon'
import * as watson from '../../services/watson'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Tag } from '.'

const app = () => express(routes)

stub(watson, 'getKeywords', () => Promise.resolve(['tag1', 'tag2']))

let userSession, adminSession, tag

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  tag = await Tag.create({ name: 'test tag' })
})

test('POST /tags 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, name: 'Test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('Test')
})

test('POST /tags 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('POST /tags/extract 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/extract')
    .send({ access_token: userSession, text: 'test' })
  expect(status).toBe(201)
  expect(Array.isArray(body)).toBe(true)
  expect(body).toHaveLength(2)
  expect(body.map((tag) => tag.name)).toEqual(['tag1', 'tag2'])
  expect(await Tag.find({})).toHaveLength(3)
})

test('POST /tags/extract 401', async () => {
  const { status } = await request(app())
    .post('/extract')
  expect(status).toBe(401)
})

test('GET /tags 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /tags/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`/${tag.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(tag.id)
})

test('GET /tags/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`/${tag.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /tags/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${tag.id}`)
  expect(status).toBe(401)
})

test('GET /tags/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /tags/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`/${tag.id}`)
    .send({ access_token: adminSession, name: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(tag.id)
  expect(body.name).toEqual('test')
})

test('PUT /tags/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`/${tag.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /tags/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${tag.id}`)
  expect(status).toBe(401)
})

test('PUT /tags/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: adminSession, name: 'test' })
  expect(status).toBe(404)
})

test('DELETE /tags/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`/${tag.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /tags/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${tag.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /tags/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${tag.id}`)
  expect(status).toBe(401)
})

test('DELETE /tags/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
