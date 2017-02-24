import multer from 'multer'
import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, join, leave, updatePhoto, destroy } from './controller'
import { create as createDemand, index as indexDemand, update as updateDemand, destroy as destroyDemand } from '../demand/controller'
import { create as createDonor, index as indexDonor, update as updateDonor, destroy as destroyDonor } from '../donor/controller'
import { schema } from './model'
import { schema as demandSchema } from '../demand/model'
import { schema as donorSchema } from '../donor/model'
export Initiative, { schema } from './model'

const router = new Router()
const upload = multer({
  limits: {
    fileSize: 2 * Math.pow(1024, 2) // 2MB
  }
})
const { title, slug, summary, description, featured, tags, user, users } = schema.tree
const { title: demandTitle, description: demandDescription, quantity: demandQuantity, donors } = demandSchema.tree
const { quantity: donorQuantity } = donorSchema.tree

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

// Demands endpoints
/**
 * @api {post} /initiatives/:id/demands Create demand
 * @apiName CreateDemand
 * @apiGroup Demand
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Demand's title.
 * @apiParam description Demand's description.
 * @apiParam quantity Demand's quantity.
 * @apiParam donors Demand's donors.
 * @apiSuccess {Object} demand Demand's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Demand not found.
 * @apiError 401 user access only.
 */
router.post('/:id/demands',
  token({ required: true }),
  body({ title: demandTitle, description: demandDescription, quantity: demandQuantity, donors }),
  createDemand)

/**
 * @api {get} /initiatives/:id/demands Retrieve demands
 * @apiName RetrieveDemands
 * @apiGroup Demand
 * @apiUse listParams
 * @apiSuccess {Object[]} demands List of demands.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/:id/demands',
  query(),
  indexDemand)

/**
 * @api {put} /initiatives/:id/demands/:id Update demand
 * @apiName UpdateDemand
 * @apiGroup Demand
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title Demand's title.
 * @apiParam description Demand's description.
 * @apiParam quantity Demand's quantity.
 * @apiParam donors Demand's donors.
 * @apiSuccess {Object} demand Demand's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Demand not found.
 * @apiError 401 user access only.
 */
router.put('/:id/demands/:demandId',
  token({ required: true }),
  body({ demandTitle, demandDescription, demandQuantity, donors }),
  updateDemand)

/**
 * @api {delete} /initiatives/:id/demands/:id Delete demand
 * @apiName DeleteDemand
 * @apiGroup Demand
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Demand not found.
 * @apiError 401 user access only.
 */
router.delete('/:id/demands/:demandId',
  token({ required: true }),
  destroyDemand)

// Demand donors endpoints
/**
 * @api {post} /initiatives/:id/demands/:id/donors Create donor
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
router.post('/:id/demands/:demandId/donors',
  token({ required: true }),
  body({ donorQuantity }),
  createDonor)

/**
 * @api {get} /initiatives/:id/demands/:id/donors Retrieve donors
 * @apiName RetrieveDonors
 * @apiGroup Donor
 * @apiUse listParams
 * @apiSuccess {Object[]} donors List of donors.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/:id/demands/:demandId/donors',
  query(),
  indexDonor)

/**
 * @api {put} /initiatives/:id/demands/:id/donors/:id Update donor
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
router.put('/:id/demands/:demandId/donors/:donorId',
  token({ required: true }),
  body({ donorQuantity }),
  updateDonor)

/**
 * @api {delete} /initiatives/:id/demands/:id/donors/:id Delete donor
 * @apiName DeleteDonor
 * @apiGroup Donor
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Donor not found.
 * @apiError 401 user access only.
 */
router.delete('/:id/demands/:demandId/donors/:donorId',
  token({ required: true }),
  destroyDonor)

export default router
