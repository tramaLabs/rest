import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Donor } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Donor.create({ ...body, user })
    .then((donor) => donor.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Donor.find(query, select, cursor)
    .populate('user')
    .then((donors) => donors.map((donor) => donor.view()))
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Donor.findById(params.donorId)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((donor) => donor ? _.merge(donor, body).save() : null)
    .then((donor) => donor ? donor.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Donor.findById(params.donorId)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((donor) => donor ? donor.remove() : null)
    .then(success(res, 204))
    .catch(next)
