import nock from 'nock'
import * as flickr from '.'

it('parses photos from flickr', async () => {
  const res = {
    stat: 'ok',
    photos: {
      photo: [{
        id: '3705116669',
        owner: '98651634@N00',
        title: 'Moon',
        ownername: 'emreterok',
        url_t: 'https://farm4.staticflickr.com/3421/3705116669_df55434403_t.jpg',
        height_t: '75',
        width_t: '100',
        url_s: 'https://farm4.staticflickr.com/3421/3705116669_df55434403_m.jpg',
        height_s: '180',
        width_s: '240',
        url_l: 'https://farm4.staticflickr.com/3421/3705116669_df55434403_b.jpg',
        height_l: '768',
        width_l: '1024'
      }, {
        id: '14113923932',
        owner: '98153870@N00',
        title: 'Moon',
        ownername: 'Ana Sofia Guerreirinho',
        url_t: 'https://farm8.staticflickr.com/7432/14113923932_da4336d85e_t.jpg',
        height_t: '100',
        width_t: '100',
        url_s: 'https://farm8.staticflickr.com/7432/14113923932_da4336d85e_m.jpg',
        height_s: '240',
        width_s: '240',
        url_m: 'https://farm8.staticflickr.com/7432/14113923932_da4336d85e.jpg',
        height_m: '500',
        width_m: '500',
        url_l: 'https://farm8.staticflickr.com/7432/14113923932_da4336d85e_b.jpg',
        height_l: '1024',
        width_l: '1024'
      }, {
        id: '3100803145',
        owner: '55922094@N00',
        title: 'Moon',
        ownername: 'Paul Garland',
        url_t: 'https://farm4.staticflickr.com/3017/3100803145_089af9ae29_t.jpg',
        height_t: '88',
        width_t: '100',
        url_s: 'https://farm4.staticflickr.com/3017/3100803145_089af9ae29_m.jpg',
        height_s: '211',
        width_s: '240',
        url_m: 'https://farm4.staticflickr.com/3017/3100803145_089af9ae29.jpg',
        height_m: '439',
        width_m: '500'
      }]
    }
  }

  nock('https://api.flickr.com').get('/services/rest').query(true).reply(200, res)

  const photos = await flickr.getPhotos('Moon')
  expect(Array.isArray(photos)).toBe(true)
  expect(photos.length).toBe(2)
  photos.forEach((photo) => {
    expect(Object.keys(photo)).toEqual([
      'id', 'owner', 'url', 'title', 'thumbnail', 'small', 'medium', 'large'
    ])
  })
  expect(photos[0].thumbnail).toEqual({
    src: res.photos.photo[0].url_t,
    width: res.photos.photo[0].width_t,
    height: res.photos.photo[0].height_t
  })
  expect(photos[0].small).toEqual({
    src: res.photos.photo[0].url_s,
    width: res.photos.photo[0].width_s,
    height: res.photos.photo[0].height_s
  })
  expect(photos[0].medium).toEqual({
    src: res.photos.photo[0].url_s,
    width: res.photos.photo[0].width_s,
    height: res.photos.photo[0].height_s
  })
  expect(photos[0].large).toEqual({
    src: res.photos.photo[0].url_l,
    width: res.photos.photo[0].width_l,
    height: res.photos.photo[0].height_l
  })
  expect(photos[1].thumbnail).toEqual({
    src: res.photos.photo[1].url_t,
    width: res.photos.photo[1].width_t,
    height: res.photos.photo[1].height_t
  })
  expect(photos[1].small).toEqual({
    src: res.photos.photo[1].url_s,
    width: res.photos.photo[1].width_s,
    height: res.photos.photo[1].height_s
  })
  expect(photos[1].medium).toEqual({
    src: res.photos.photo[1].url_m,
    width: res.photos.photo[1].width_m,
    height: res.photos.photo[1].height_m
  })
  expect(photos[1].large).toEqual({
    src: res.photos.photo[1].url_l,
    width: res.photos.photo[1].width_l,
    height: res.photos.photo[1].height_l
  })
})

it('throws an error', async () => {
  nock('https://api.flickr.com').get('/services/rest').query(true).reply(200, {})
  return flickr.getPhotos('Moon').then(() => {
    throw new Error('Expected to fail')
  }).catch(() => null)
})
