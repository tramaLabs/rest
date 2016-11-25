import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import '../user'
import '../photo'

const initiativeSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 96
  },
  description: {
    type: String,
    maxlength: 2048
  },
  photo: {
    type: Schema.ObjectId,
    ref: 'Photo'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

initiativeSchema.methods = {
  view (full) {
    const view = {
      id: this.id,
      title: this.title,
      user: this.user ? this.user.view() : undefined,
      users: this.users ? this.users.map((user) => user.view()) : undefined,
      photo: this.photo ? this.photo.view() : undefined,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view,
      description: this.description
    } : view
  }
}

initiativeSchema.plugin(mongooseKeywords, { paths: ['title'] })

const model = mongoose.model('Initiative', initiativeSchema)

export const schema = model.schema
export default model
