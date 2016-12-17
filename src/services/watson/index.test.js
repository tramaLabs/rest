import nock from 'nock'
import * as watson from '.'

it('gets keywords', async () => {
  const response = {
    status: 'OK',
    language: 'english',
    concepts: [{
      text: 'Thomas J. Watson',
      relevance: '0.926128',
      dbpedia: 'http://dbpedia.org/resource/Thomas_J._Watson',
      freebase: 'http://rdf.freebase.com/ns/m.07qkt',
      yago: 'http://yago-knowledge.org/resource/Thomas_J._Watson'
    }, {
      text: 'Lotus Software',
      relevance: '0.881696',
      website: 'http://www.ibm.com/software/lotus',
      dbpedia: 'http://dbpedia.org/resource/Lotus_Software',
      freebase: 'http://rdf.freebase.com/ns/m.0q4jd',
      opencyc: 'http://sw.opencyc.org/concept/Mx4rvViJIZwpEbGdrcN5Y29ycA',
      yago: 'http://yago-knowledge.org/resource/Lotus_Software'
    }, {
      text: 'Lotus Software',
      relevance: '0.881696',
      website: 'http://www.ibm.com/software/lotus',
      dbpedia: 'http://dbpedia.org/resource/Lotus_Software',
      freebase: 'http://rdf.freebase.com/ns/m.0q4jd',
      opencyc: 'http://sw.opencyc.org/concept/Mx4rvViJIZwpEbGdrcN5Y29ycA',
      yago: 'http://yago-knowledge.org/resource/Lotus_Software'
    }, {
      text: 'Thomas J. Watson Research Center',
      relevance: '0.7476',
      dbpedia: 'http://dbpedia.org/resource/Thomas_J._Watson_Research_Center',
      freebase: 'http://rdf.freebase.com/ns/m.04zkt5',
      yago: 'http://yago-knowledge.org/resource/Thomas_J._Watson_Research_Center'
    }],
    keywords: [{
      relevance: '0.942127',
      text: 'IBM Watson service'
    }, {
      relevance: '0.47506',
      text: 'test case'
    }]
  }
  nock('https://gateway-a.watsonplatform.net')
    .get('/calls/text/TextGetCombinedData')
    .query(true)
    .reply(200, response)

  const keywords = await watson.getKeywords('This is a test case for IBM Watson service')
  expect(Array.isArray(keywords)).toBe(true)
  expect(keywords).toEqual([
    'Thomas J. Watson', 'Lotus Software', 'Thomas J. Watson Research Center',
    'IBM Watson service', 'test case'
  ])
})

it('throws an error', async () => {
  nock('https://gateway-a.watsonplatform.net')
    .get('/calls/text/TextGetCombinedData')
    .query(true)
    .reply(200, {
      status: 'ERROR'
    })
  return watson.getKeywords('test').then(() => {
    throw new Error('Expected to fail')
  }).catch(() => null)
})
