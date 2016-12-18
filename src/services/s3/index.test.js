import { AWS as config } from '../../config'
import { upload } from '.'

jest.mock('aws-sdk', () => ({
  S3: class {
    putObject = () => ({ promise: () => Promise.resolve() })
  }
}))

test('upload', async () => {
  const url = await upload('foo', 'foo.txt')
  expect(url).toBe(`https://s3.amazonaws.com/${config.bucket}/foo.txt`)
})
