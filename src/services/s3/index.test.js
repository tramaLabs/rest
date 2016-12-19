import { AWS as config } from '../../config'
import { upload, remove } from '.'

jest.mock('aws-sdk', () => ({
  S3: class {
    putObject = () => ({ promise: () => Promise.resolve() })
    deleteObject = () => ({ promise: () => Promise.resolve() })
  }
}))

test('upload', async () => {
  const url = await upload('foo', 'foo.txt', 'text/plain')
  expect(url).toBe(`https://s3.amazonaws.com/${config.bucket}/foo.txt`)
})

test('remove', async () => {
  await remove('foo.txt')
})
