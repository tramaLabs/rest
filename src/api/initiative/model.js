import mongoose, { Schema } from 'mongoose'

const initiativeSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String
  },
  photo: {
    type: String
  },
  users: {
    type: String
  }
}, {
  timestamps: true
})

initiativeSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      title: this.title,
      photo: this.photo,
      users: this.users,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

module.exports = mongoose.model('Initiative', initiativeSchema)
export default module.exports
