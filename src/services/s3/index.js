import { S3 } from 'aws-sdk'
import { AWS as config } from '../../config'

const s3 = new S3({
  apiVersion: '2006-03-01',
  region: config.region
})

export const upload = (Body, Key, ACL = 'public-read') =>
  s3.putObject({ Body, Key, ACL, Bucket: config.bucket })
    .promise()
    .then((data) => `https://s3.amazonaws.com/${config.bucket}/${Key}`)
