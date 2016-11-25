import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Initiative } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Initiative.create({ ...body, user })
    .then((initiative) => initiative.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Initiative.find(query, select, cursor)
    .populate('user')
    .then((initiatives) => initiatives.map((initiative) => initiative.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Initiative.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((initiative) => initiative ? initiative.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Initiative.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((initiative) => initiative ? _.merge(initiative, body).save() : null)
    .then((initiative) => initiative ? initiative.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Initiative.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((initiative) => initiative ? initiative.remove() : null)
    .then(success(res, 204))
    .catch(next)
