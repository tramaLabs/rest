import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import mongooseCreateUnique from 'mongoose-create-unique'
import '../initiative'

const tagSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    lowercase: true
  },
  count: {
    type: Number,
    default: 0
  },
  keywords: {
    type: [String],
    unique: true
  }
})

tagSchema.pre('remove', function (next) {
  const Initiative = this.model('Initiative')
  Initiative.update(
    { tags: this },
    { $pull: { tags: this._id } },
    { multi: true }
  ).exec(next)
})

tagSchema.methods = {
  view () {
    return {
      id: this.id,
      name: this.name,
      count: this.count
    }
  }
}

tagSchema.statics = {
  increment (tags, amount = 1) {
    if (!tags.length) {
      return Promise.resolve()
    }
    return this.update(
      { _id: { $in: tags.map(({ _id }) => _id) } },
      { $inc: { count: amount } },
      { multi: true }
    ).exec()
  }
}

tagSchema.plugin(mongooseKeywords, { paths: ['name'] })
tagSchema.plugin(mongooseCreateUnique)

const model = mongoose.model('Tag', tagSchema)

export const schema = model.schema
export default model
