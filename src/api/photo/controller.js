import { success, notFound } from '../../services/response/'
import { getPhotos } from '../../services/flickr'
import { Photo } from '.'

export const index = ({ query: { q, page, limit } }, res, next) => {
  getPhotos(q, { page, limit })
    .then((photos) => Promise.all(photos.map((p) => Photo.createFromService(p))))
    .then((photos) => photos.map((photo) => photo.view()))
    .then(success(res))
    .catch(next)
}

export const show = ({ params }, res, next) =>
  Photo.findById(params.id)
    .then(notFound(res))
    .then((photo) => photo ? photo.view() : null)
    .then(success(res))
    .catch(next)
