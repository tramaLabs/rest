import multer from 'multer'
import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, join, leave, updatePhoto, destroy } from './controller'
import { schema } from './model'
export Initiative, { schema } from './model'

const router = new Router()
const upload = multer({
  limits: {
    fileSize: 2 * Math.pow(1024, 2) // 2MB
  }
})
const { title, slug, summary, description, featured, tags, user, users } = schema.tree

/**
 * @api {post} /initiatives Create initiative
 * @apiName CreateInitiative
 * @apiGroup Initiative
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Initiative's title.
 * @apiParam slug Initiative's slug.
 * @apiParam summary Initiative's summary.
 * @apiParam description Initiative's description.
 * @apiParam tags Initiative's tags.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ title, slug, summary, description, tags }),
  create)

/**
 * @api {get} /initiatives Retrieve initiatives
 * @apiName RetrieveInitiatives
 * @apiGroup Initiative
 * @apiUse listParams
 * @apiParam user User id(s) to filter initiatives.
 * @apiParam featured to filter initiatives.
 * @apiSuccess {Object[]} initiatives List of initiatives.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query({ featured, user, users }),
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
 * @apiParam summary Initiative's summary.
 * @apiParam description Initiative's description.
 * @apiParam tags Initiative's tags.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ title: {...title, required: false}, summary, description, featured, tags }),
  update)

/**
 * @api {put} /initiatives/:id/join Join initiative
 * @apiName JoinInitiative
 * @apiGroup Initiative
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.put('/:id/join',
  token({ required: true }),
  join)

/**
 * @api {put} /initiatives/:id/leave Leave initiative
 * @apiName LeaveInitiative
 * @apiGroup Initiative
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.put('/:id/leave',
  token({ required: true }),
  leave)

/**
 * @api {put} /initiatives/:id/photo Update initiative photo
 * @apiName UpdateInitiativePhoto
 * @apiGroup Initiative
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam data The file.
 * @apiSuccess {Object} initiative Initiative's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Initiative not found.
 * @apiError 401 user access only.
 */
router.put('/:id/photo',
  token({ required: true }),
  upload.single('data'),
  updatePhoto)


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
