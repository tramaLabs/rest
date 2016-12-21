import Promise from 'bluebird'
import _ from 'lodash'
import { uid } from 'rand-token'
import { success, notFound, authorOrAdmin } from '../../services/response'
import * as s3 from '../../services/s3'
import Image from '../../services/image'
import { Initiative } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Initiative.create({ ...body, user })
    .then((initiative) => initiative.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Initiative.find(query, select, cursor)
    .populate('user users tags')
    .then((initiatives) => initiatives.map((initiative) => initiative.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Initiative.findById(params.id)
    .populate('user users tags')
    .then(notFound(res))
    .then((initiative) => initiative ? initiative.view(true) : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Initiative.findById(params.id)
    .populate('user users tags')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((initiative) => initiative ? _.merge(initiative, body).save() : null)
    .then((initiative) => initiative ? initiative.view(true) : null)
    .then(success(res))
    .catch(next)

export const join = ({ user, params }, res, next) =>
  Initiative.findById(params.id)
    .then(notFound(res))
    .then((initiative) => {
      if (!initiative) return null
      initiative.users.pull(user)
      initiative.users.unshift(user)
      return initiative.save()
    })
    .then((initiative) => initiative ? initiative.view() : null)
    .then(success(res))
    .catch(next)

export const leave = ({ user, params }, res, next) =>
  Initiative.findById(params.id)
    .then(notFound(res))
    .then((initiative) => {
      if (!initiative) return null
      initiative.users.pull(user.id)
      return initiative.save()
    })
    .then((initiative) => initiative ? initiative.view() : null)
    .then(success(res))
    .catch(next)

const removeCurrentPhotos = (initiative) => {
  const sizes = Object.keys(initiative.photo.toObject())
  const promises = []
  if (sizes.length) {
    // istanbul ignore next
    promises.push(sizes.map((size) => s3.remove(initiative.photo[size])))
  }
  return Promise.all(promises)
}

const uploadResizedPhotos = (image) => {
  const uniqueId = uid(24)
  const getFileName = (size) => `${uniqueId}_${size}.jpg`
  const sizes = {
    large: [1024, 768],
    medium: [640, 480],
    small: [320, 240]
  }
  const promises = Object.keys(sizes).reduce((object, size) => {
    object[size] = image.clone().quality(60).scaleToFit(...sizes[size]).getBuffer()
    return object
  }, {})
  return Promise.props(promises).then((buffers) =>
    Promise.props(
      Object.keys(buffers).reduce((object, size) => {
        object[size] = s3.upload(buffers[size], getFileName(size), 'image/jpeg')
        return object
      }, {})
    )
  )
}

export const updatePhoto = ({ user, params, file }, res, next) =>
  Initiative.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((initiative) => {
      if (!initiative) return null
      removeCurrentPhotos(initiative)
      return Image.read(file.buffer).then((image) => {
        initiative.color = image.getPredominantColorHex()
        return uploadResizedPhotos(image)
      }).then((photo) => {
        initiative.photo = photo
        return initiative.save()
      })
    })
    .then((initiative) => initiative ? initiative.view() : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Initiative.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((initiative) => initiative ? initiative.remove() : null)
    .then(success(res, 204))
    .catch(next)
