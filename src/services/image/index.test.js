import path from 'path'
import Image from '.'

let image

beforeAll(async () => {
  image = await Image.read(path.join(__dirname, '../../../test/tramalogo.jpg'))
})

test('getPredominantColorHex', async () => {
  const color = await image.getPredominantColorHex()
  expect(color).toBe('#1e1e1d')
})

test('quality', () => {
  image.quality(50)
})

test('scaleToFit', () => {
  image.scaleToFit(500, 500)
})

test('clone', () => {
  const clone = image.clone()
  expect(image).toEqual(image)
  expect(clone).not.toEqual(image)
})

test('getBuffer', () => image.getBuffer())
