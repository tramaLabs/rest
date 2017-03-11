import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Demand } from '.'
import { Initiative } from '../initiative'

export const create = ({ params, user, bodymen: { body } }, res, next) => {
  Initiative.findById(params.id)
  .then(notFound(res))
  .then((initiative) => {
    if (!initiative) return null

    return Demand.create({ ...body, creator: user }).then((demand) => {
      initiative.demands.addToSet(demand)
      return initiative.save()
    })
  })
    .then((initiative) => initiative ? initiative.populate('demands').execPopulate() : null)
    .then((initiative) => initiative ? initiative.view(true).demands : null)
    .then(success(res, 201))
    .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Demand.find(query, select, cursor)
    .populate('creator donors donors.user')
    .then((demands) => demands.map((demand) => demand.view(true)))
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Demand.findById(params.demandId)
    .populate('creator donors donors.user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'creator'))
    .then((demand) => demand ? _.merge(demand, body).save() : null)
    .then((demand) => demand ? demand.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Initiative.findById(params.id)
  .then(notFound(res))
  .then((initiative) => {
    if (!initiative) return null

    return Demand.findById(params.demandId)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'creator'))
    .then((demand) => demand ? demand.remove() : null)
    .then((demand) => {
      initiative.demands.pull(demand)
      return initiative.save()
    })
  })
    .then(success(res, 204))
    .catch(next)
