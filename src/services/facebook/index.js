import request from 'request-promise'

export const getUser = (accessToken) =>
  request({
    uri: 'https://graph.facebook.com/me',
    json: true,
    qs: {
      access_token: accessToken,
      fields: 'id, name, email'
    }
  }).then(({ id, name, email }) => ({
    service: 'facebook',
    picture: `https://graph.facebook.com/${id}/picture?type=normal`,
    id,
    name,
    email
  }))
