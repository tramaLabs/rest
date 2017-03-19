import mongoose, { Schema } from 'mongoose'

const donorSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number
  }
}, {
  timestamps: true
})

donorSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      quantity: this.quantity,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Donor', donorSchema)

export const schema = model.schema
export default model
