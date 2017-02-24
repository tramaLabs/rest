import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import summary from 'node-summary'
import { kebabCase } from 'lodash'
import '../user'
import '../tag'
import '../demand'

const initiativeSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 96
  },
  slug: {
    type: String,
    set: kebabCase
  },
  featured: {
    type: Boolean
  },
  summary: {
    type: String,
    maxlength: 2048
  },
  description: {
    type: String,
    maxlength: 2048
  },
  color: {
    type: String
  },
  photo: {
    small: String,
    medium: String,
    large: String
  },
  tags: [{
    type: Schema.ObjectId,
    ref: 'Tag'
  }],
  demands: [{
    type: Schema.ObjectId,
    ref: 'Demand'
  }],
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

initiativeSchema.pre('save', function (next) {
  if (this.users.length === 0 && this.user) {
    this.users.push(this.user)
  }

  if (!this.slug) {
    this.slug = this.title
  }

  if (!this.summary && this.description) {
    summary.summarize('', this.description, (err, text) => {
      // istanbul ignore else
      if (!err) {
        this.summary = text
      }
      next()
    })
  } else {
    next()
  }
})

initiativeSchema.methods = {
  view (full) {
    const view = {
      id: this.id,
      title: this.title,
      slug: this.slug,
      summary: this.summary,
      featured: this.featured,
      color: this.color,
      photo: this.photo,
      tags: this.tags ? this.tags.map((tag) => tag.view()) : undefined,
      demands: this.demands ? this.demands.map((demand) => demand.view()) : undefined,
      user: this.user ? this.user.view() : undefined,
      users: this.users ? this.users.map((user) => user.view()) : undefined,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view,
      description: this.description
    } : view
  }
}

initiativeSchema.plugin(mongooseKeywords, { paths: ['title', 'tags'] })

const model = mongoose.model('Initiative', initiativeSchema)

export const schema = model.schema
export default model
