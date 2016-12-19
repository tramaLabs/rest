import Jimp from 'jimp'

class Image {
  static read (src) {
    return Jimp.read(src).then((image) => {
      return new Image(image)
    })
  }

  constructor (image) {
    this.image = image
  }

  getPredominantColorHex () {
    const pixel = this.image.clone().resize(1, 1)
    return `#${pixel.getPixelColor(0, 0).toString(16).slice(0, 6)}`
  }

  quality (n) {
    this.image.quality(n)
    return this
  }

  scaleToFit (width, height) {
    this.image.scaleToFit(width, height)
    return this
  }

  clone () {
    return new Image(this.image.clone())
  }

  getBuffer (mime = Jimp.MIME_JPEG) {
    return new Promise((resolve, reject) => {
      this.image.getBuffer(mime, (err, buffer) => {
        // istanbul ignore next
        if (err) return reject(err)
        resolve(buffer)
      })
    })
  }

}

export default Image
