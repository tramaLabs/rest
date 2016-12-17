import request from 'request-promise'
import _ from 'lodash'
import { watsonKey as apikey } from '../../config'

export const getKeywords = (text) =>
  request({
    uri: 'https://gateway-a.watsonplatform.net/calls/text/TextGetCombinedData',
    json: true,
    qs: {
      apikey,
      text,
      extract: 'keyword,concept',
      outputMode: 'json'
    }
  }).then((res) => {
    if (res.status !== 'OK') throw new Error(res.statusInfo)
    return _.uniq([...res.concepts, ...res.keywords].map((keyword) => _.deburr(keyword.text)))
  })
