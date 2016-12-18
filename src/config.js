/* eslint-disable no-unused-vars */
import path from 'path'
import _ from 'lodash'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  const dotenv = require('dotenv-safe')
  dotenv.load({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    defaultEmail: 'no-reply@trama.com',
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    flickrKey: requireProcessEnv('FLICKR_KEY'),
    watsonKey: requireProcessEnv('WATSON_KEY'),
    fbAppSecret: requireProcessEnv('FB_APP_SECRET'),
    AWS: {
      accessKeyId: requireProcessEnv('AWS_ACCESS_KEY_ID'),
      secrectAccessKey: requireProcessEnv('AWS_SECRET_ACCESS_KEY'),
      region: 'us-east-1',
      bucket: 'trama-photos'
    },
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: {
    mongo: {
      uri: 'mongodb://localhost/trama-test',
      options: {
        debug: false
      }
    }
  },
  development: {
    fbAppSecret: requireProcessEnv('FB_APP_SECRET_DEV'),
    mongo: {
      uri: 'mongodb://localhost/trama-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/trama'
    }
  }
}

module.exports = _.merge(config.all, config[config.all.env])
export default module.exports
