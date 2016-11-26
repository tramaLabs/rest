import request from 'supertest-as-promised'
import { stub } from 'sinon'
import * as flickr from '../../services/flickr'
import express from '../../services/express'
import routes, { Photo } from '.'

const app = () => express(routes)

stub(flickr, 'getPhotos', () => Promise.resolve([{
  id: '3705116669',
  owner: 'emreterok',
  url: 'url',
  title: 'Moon',
  thumbnail: { src: 'test.jpg', width: 100, height: 100 },
  small: { src: 'test.jpg', width: 100, height: 100 },
  medium: { src: 'test.jpg', width: 100, height: 100 },
  large: { src: 'test.jpg', width: 100, height: 100 }
}, {
  id: '14113923932',
  owner: 'Ana Sofia Guerreirinho',
  url: 'url',
  title: 'Moon',
  thumbnail: { src: 'test.jpg', width: 100, height: 100 },
  small: { src: 'test.jpg', width: 100, height: 100 },
  medium: { src: 'test.jpg', width: 100, height: 100 },
  large: { src: 'test.jpg', width: 100, height: 100 }
}, {
  id: '3100803145',
  owner: 'Paul Garland',
  url: 'url',
  title: 'Moon',
  thumbnail: { src: 'test.jpg', width: 100, height: 100 },
  small: { src: 'test.jpg', width: 100, height: 100 },
  medium: { src: 'test.jpg', width: 100, height: 100 },
  large: { src: 'test.jpg', width: 100, height: 100 }
}]))

let photo

beforeEach(async () => {
  photo = await Photo.create({ title: 'test' })
})

test('GET /photos 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBe(3)
})

test('GET /photos?q=Moon 200', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ q: 'Moon' })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBe(3)
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
