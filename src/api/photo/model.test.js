import { stub } from 'sinon'
import { Photo } from '.'
import { Initiative } from '../initiative'

stub(Photo.prototype, 'pickColor', () => '#000000')

let photo

beforeEach(async () => {
  photo = await Photo.create({ title: 'test' })
})

describe('pre remove', () => {
  it('removes photo reference from initiative', async () => {
    await Initiative.create({ photo, title: 'test' })
    expect((await Initiative.find({ photo })).length).toBe(1)
    await photo.remove()
    expect((await Initiative.find({ photo })).length).toBe(0)
  })
})

describe('view', () => {
  it('returns a view', () => {
    photo.thumbnail = { src: 'test.jpg' }
    const view = photo.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(photo.id)
    expect(view.title).toBe(photo.title)
    expect(view.thumbnail.src).toBe(photo.thumbnail.src)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})

describe('createFromService', () => {
  const servicePhoto = {
    id: '955138',
    owner: 'foo',
    url: 'http://example.com',
    title: 'bar',
    thumbnail: {
      src: 'http://example.com/123_t',
      width: '100',
      height: '100'
    },
    small: {
      src: 'http://example.com/123_s',
      width: '200',
      height: '200'
    },
    medium: {
      src: 'http://example.com/123_m',
      width: '300',
      height: '300'
    },
    large: {
      src: 'http://example.com/123_l',
      width: '400',
      height: '400'
    }
  }

  it('updates the existent photo', async () => {
    await Photo.createFromService({ ...servicePhoto, id: photo.id })
    expect((await Photo.find({})).length).toBe(1)
  })

  it('creates a new photo', async () => {
    await Photo.createFromService(servicePhoto)
    expect((await Photo.find({})).length).toBe(2)
  })
})
