import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, updateUsers, destroy } from './controller'
import { schema } from './model'
export Initiative, { schema } from './model'

const router = new Router()
const { title, description, photo, users } = schema.tree

/**
 * @api {post} /initiatives Create initiative
 * @apiName CreateInitiative
 * @apiGroup Initiative
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Initiative's title.
 * @apiParam photo Initiative's photo id.
 * @apiParam description Initiative's description.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ title, description, photo }),
  create)

/**
 * @api {get} /initiatives Retrieve initiatives
 * @apiName RetrieveInitiatives
 * @apiGroup Initiative
 * @apiUse listParams
 * @apiParam user User id(s) to filter initiatives.
 * @apiSuccess {Object[]} initiatives List of initiatives.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query({
    user: { ...users, paths: ['users'] }
  }),
  index)

/**
 * @api {get} /initiatives/:id Retrieve initiative
 * @apiName RetrieveInitiative
 * @apiGroup Initiative
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /initiatives/:id Update initiative
 * @apiName UpdateInitiative
 * @apiGroup Initiative
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Initiative's title.
 * @apiParam description Initiative's description.
 * @apiParam photo Initiative's photo id.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, description, photo }),
  update)

/**
 * @api {put} /initiatives/:id/users Update initiative's users
 * @apiName UpdateInitiativeUsers
 * @apiGroup Initiative
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam add User id(s) to add to the initiative's user list.
 * @apiParam remove User id(s) to remove from the initiative's user list.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.put('/:id/users',
  token({ required: true }),
  body({ add: users, remove: users }),
  updateUsers)

/**
 * @api {delete} /initiatives/:id Delete initiative
 * @apiName DeleteInitiative
 * @apiGroup Initiative
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
