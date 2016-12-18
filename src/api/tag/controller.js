import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { getKeywords } from '../../services/watson/'
import { Tag } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Tag.createUnique(body)
    .then((tag) => tag.view(true))
    .then(success(res, 201))
    .catch(next)

export const createFromText = ({ bodymen: { body } }, res, next) => {
  getKeywords(body.text)
    .then((tags) => Tag.createUnique(tags.map((name) => ({ name }))))
    .then((tags) => tags.map((tag) => tag.view()))
    .then(success(res, 201))
    .catch(next)
}
export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Tag.find(query, select, cursor)
    .then((tags) => tags.map((tag) => tag.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Tag.findById(params.id)
    .then(notFound(res))
    .then((tag) => tag ? tag.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Tag.findById(params.id)
    .then(notFound(res))
    .then((tag) => tag ? _.merge(tag, body).save() : null)
    .then((tag) => tag ? tag.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Tag.findById(params.id)
    .then(notFound(res))
    .then((tag) => tag ? tag.remove() : null)
    .then(success(res, 204))
    .catch(next)
