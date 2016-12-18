import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, createFromText, index, show, update, destroy } from './controller'
import { schema } from './model'
export Tag, { schema } from './model'

const router = new Router()
const { name } = schema.tree

/**
 * @api {post} /tags Create tag
 * @apiName CreateTag
 * @apiGroup Tag
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Tag's name.
 * @apiSuccess {Object} tag Tag's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ name }),
  create)

/**
 * @api {post} /tags/extract Extract and create tags from text
 * @apiName ExtractTags
 * @apiGroup Tag
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam {String} text Text.
 * @apiSuccess {Object[]} tags List of tags.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.post('/extract',
  token({ required: true }),
  body({ text: { type: String, required: true } }),
  createFromText)

/**
 * @api {get} /tags Retrieve tags
 * @apiName RetrieveTags
 * @apiGroup Tag
 * @apiUse listParams
 * @apiSuccess {Object[]} tags List of tags.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query({ sort: '-count' }),
  index)

/**
 * @api {get} /tags/:id Retrieve tag
 * @apiName RetrieveTag
 * @apiGroup Tag
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} tag Tag's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Tag not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  show)

/**
 * @api {put} /tags/:id Update tag
 * @apiName UpdateTag
 * @apiGroup Tag
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Tag's name.
 * @apiSuccess {Object} tag Tag's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Tag not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
  body({ name }),
  update)

/**
 * @api {delete} /tags/:id Delete tag
 * @apiName DeleteTag
 * @apiGroup Tag
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Tag not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
