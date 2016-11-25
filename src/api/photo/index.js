import { Router } from 'express'
import { middleware as query } from 'querymen'
import { index, show } from './controller'
export Photo, { schema } from './model'

const router = new Router()

/**
 * @api {get} /photos Retrieve photos
 * @apiName RetrievePhotos
 * @apiGroup Photo
 * @apiUse listParams
 * @apiSuccess {Object[]} photos List of photos.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /photos/:id Retrieve photo
 * @apiName RetrievePhoto
 * @apiGroup Photo
 * @apiSuccess {Object} photo Photo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Photo not found.
 */
router.get('/:id',
  show)

export default router
