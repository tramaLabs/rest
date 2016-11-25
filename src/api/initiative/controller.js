import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Initiative } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Initiative.create({ ...body, user, users: [user] })
    .then((initiative) => initiative.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Initiative.find(query, select, cursor)
    .populate('user users photo')
    .then((initiatives) => initiatives.map((initiative) => initiative.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Initiative.findById(params.id)
    .populate('user users photo')
    .then(notFound(res))
    .then((initiative) => initiative ? initiative.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Initiative.findById(params.id)
    .populate('user users photo')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'users'))
    .then((initiative) => initiative ? _.merge(initiative, body).save() : null)
    .then((initiative) => initiative ? initiative.view(true) : null)
    .then(success(res))
    .catch(next)

export const updateUsers = ({ user, bodymen: { body: { add, remove } }, params }, res, next) => {
  const op = add ? 'addToSet' : 'pull'
  const users = [].concat(add || remove)

  Initiative.findById(params.id)
    .populate('user users photo')
    .then(notFound(res))
    .then((initiative) => {
      const isAuthor = () => user.equals(initiative.user)
      const isMember = () => ~initiative.users.find((u) => user.equals(u))

      if (isAuthor()) {
        initiative.users[op](...users)
      } else if (isMember() && users.length === 1 && user.equals(users[0])) {
        initiative.users[op](user)
      } else {
        res.status(401).end()
        return null
      }
      return initiative.save()
    })
    .then((initiative) => initiative ? initiative.populate('users').execPopulate() : null)
    .then((initiative) => initiative ? initiative.view() : null)
    .then(success(res))
    .catch(next)
}

export const destroy = ({ user, params }, res, next) =>
  Initiative.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'users'))
    .then((initiative) => initiative ? initiative.remove() : null)
    .then(success(res, 204))
    .catch(next)
