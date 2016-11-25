import mongoose, { Schema } from 'mongoose'
import jimp from 'jimp'
import { uid } from 'rand-token'
import mongooseKeywords from 'mongoose-keywords'
import mongooseCreateUnique from 'mongoose-create-unique'
import '../initiative'

const photoObjectSchema = new Schema({
  src: String,
  width: Number,
  height: Number
})

const photoSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: () => uid(24)
  },
  color: String,
  thumbnail: photoObjectSchema,
  small: photoObjectSchema,
  medium: photoObjectSchema,
  large: photoObjectSchema,
  owner: String,
  url: String,
  title: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

photoSchema.pre('remove', function (next) {
  const Initiative = this.model('Initiative')
  Initiative.update(
    { photo: this },
    { $unset: { photo: '' } },
    { multi: true }
  ).exec(next)
})

photoSchema.methods = {
  view () {
    const sizes = ['thumbnail', 'small', 'medium', 'large']
    const { id, title, owner, url, color, createdAt, updatedAt } = this
    let view = { id, title, owner, url, color, createdAt, updatedAt }

    sizes.forEach((size) => {
      if (!this[size]) return
      const { src, width, height } = this[size]
      view[size] = { src, width, height }
    })

    return view
  },

  pickColor () {
    /* istanbul ignore next */
    return jimp.read(this.thumbnail.src).then((image) => {
      image.resize(1, 1)
      this.color = `#${image.getPixelColor(0, 0).toString(16).slice(0, 6)}`
      return this.save()
    })
  }
}

photoSchema.statics = {
  createFromService ({ id, owner, url, title, thumbnail, small, medium, large }) {
    return this.createUnique({ _id: id, owner, url, title, thumbnail, small, medium, large })
  }
}

photoSchema.plugin(mongooseKeywords, { paths: ['title', 'owner'] })
photoSchema.plugin(mongooseCreateUnique)

const model = mongoose.model('Photo', photoSchema)

export const schema = model.schema
export default model
