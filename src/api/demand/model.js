import mongoose, { Schema } from 'mongoose'
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const demandSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  quantity: {
    type: Number
  },
  donors: [{
    type: Schema.ObjectId,
    ref: 'Donor'
  }]
}, {
  timestamps: true
})

demandSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      creator: this.creator.view(full),
      title: this.title,
      description: this.description,
      quantity: this.quantity,
      donors: this.donors ? this.donors.map((donor) => donor.view(true)) : undefined,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Demand', demandSchema)
demandSchema.plugin(deepPopulate)

export const schema = model.schema
export default model
