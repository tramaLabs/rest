import request from 'request-promise'
import { flickrKey } from '../../config'

export const getPhotos = (text, { limit = 20, page = 1 } = {}) =>
  request({
    uri: 'https://api.flickr.com/services/rest',
    json: true,
    qs: {
      method: 'flickr.photos.search',
      api_key: flickrKey,
      sort: 'relevance',
      license: '1,2,3,4,5,6',
      content_type: 6,
      media: 'photos',
      extras: 'owner_name,url_t,url_s,url_m,url_l',
      format: 'json',
      nojsoncallback: 1,
      per_page: limit,
      page,
      text
    }
  }).then((res) => {
    if (res.stat !== 'ok') throw new Error(res.stat)
    const flickrPhotos = res.photos.photo.filter((photo) => photo.url_l)
    const sizes = ['thumbnail', 'small', 'medium', 'large']

    const photos = flickrPhotos.map((flickrPhoto) => {
      const photo = {
        id: flickrPhoto.id,
        owner: flickrPhoto.ownername,
        url: `https://www.flickr.com/photos/${flickrPhoto.owner}/${flickrPhoto.id}`,
        title: flickrPhoto.title
      }

      sizes.forEach((size, i) => {
        let letter = size.charAt(0)
        const sizeExists = !!flickrPhoto[`url_${letter}`]
        if (!sizeExists && i > 0) {
          photo[size] = photo[sizes[i - 1]]
        } else {
          photo[size] = {
            src: flickrPhoto[`url_${letter}`],
            width: flickrPhoto[`width_${letter}`],
            height: flickrPhoto[`height_${letter}`]
          }
        }
      })

      return photo
    })

    return photos
  })
