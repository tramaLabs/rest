import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Donor } from '.'
import { Demand } from '../demand'

export const create = ({ params, user, bodymen: { body } }, res, next) => {
  Demand.findById(params.demandId)
  .then(notFound(res))
  .then((demand) => {
    if (!demand) return null

    return Donor.create({ ...body, user }).then((donor) => {
      demand.donors.addToSet(donor)
      return demand.save()
    })
  })
    .then((demand) => demand ? demand.view(true).donors : null)
    .then(success(res, 201))
    .catch(next)
}

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
  Demand.findById(params.demandId)
  .then(notFound(res))
  .then((demand) => {
    if (!demand) return null

    return Donor.findById(params.donorId)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((donor) => donor ? donor.remove() : null)
    .then((donor) => {
      demand.donors.pull(donor)
      return demand.save()
    })
  })
    .then(success(res, 204))
    .catch(next)
