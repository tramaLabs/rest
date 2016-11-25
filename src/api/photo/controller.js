import { success, notFound } from '../../services/response/'
import { Photo } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Photo.find(query, select, cursor)
    .then((photos) => photos.map((photo) => photo.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Photo.findById(params.id)
    .then(notFound(res))
    .then((photo) => photo ? photo.view() : null)
    .then(success(res))
    .catch(next)
