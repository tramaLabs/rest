import request from 'supertest-as-promised'
import express from '../../services/express'
import routes, { Photo } from '.'

const app = () => express(routes)

let photo

beforeEach(async () => {
  photo = await Photo.create({})
})

test('GET /photos 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /photos/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${photo.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(photo.id)
})

test('GET /photos/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})
