import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, update, destroy } from './controller'
import { schema } from './model'
export Demand, { schema } from './model'

const router = new Router()
const { quantity } = schema.tree

/**
 * @api {post} /demands Create donor
 * @apiName CreateDonor
 * @apiGroup Donor
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam quantity Donor's quantity.
 * @apiSuccess {Object} donor Donor's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Donor not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ quantity }),
  create)

/**
 * @api {get} /demands Retrieve demands
 * @apiName Retrievedemands
 * @apiGroup Donor
 * @apiUse listParams
 * @apiSuccess {Object[]} demands List of demands.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {put} /demands/:id Update donor
 * @apiName UpdateDonor
 * @apiGroup Donor
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam quantity Donor's quantity.
 * @apiSuccess {Object} donor Donor's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Donor not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ quantity }),
  update)

/**
 * @api {delete} /demands/:id Delete donor
 * @apiName DeleteDonor
 * @apiGroup Donor
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Donor not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
