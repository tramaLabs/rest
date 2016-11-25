import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Initiative, { schema } from './model'

const router = new Router()
const { title, photo, users } = schema.tree

/**
 * @api {post} /initiatives Create initiative
 * @apiName CreateInitiative
 * @apiGroup Initiative
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Initiative's title.
 * @apiParam photo Initiative's photo.
 * @apiParam users Initiative's users.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ title, photo, users }),
  create)

/**
 * @api {get} /initiatives Retrieve initiatives
 * @apiName RetrieveInitiatives
 * @apiGroup Initiative
 * @apiUse listParams
 * @apiSuccess {Object[]} initiatives List of initiatives.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
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
 * @apiParam photo Initiative's photo.
 * @apiParam users Initiative's users.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title, photo, users }),
  update)

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
