import crypto from 'crypto'
import request from 'request-promise'
import { fbAppSecret } from '../../config'

const getAppSecretProof = (accessToken) =>
  crypto.createHmac('sha256', fbAppSecret).update(accessToken).digest('hex')

export const getUser = (accessToken) =>
  request({
    uri: 'https://graph.facebook.com/me',
    json: true,
    qs: {
      access_token: accessToken,
      appsecret_proof: getAppSecretProof(accessToken),
      fields: 'id, name, email'
    }
  }).then(({ id, name, email }) => ({
    service: 'facebook',
    picture: `https://graph.facebook.com/${id}/picture?type=normal`,
    id,
    name,
    email
  }))
