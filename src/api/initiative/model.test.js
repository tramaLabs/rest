import { Initiative } from '.'
import { User } from '../user'
import { Tag } from '../tag'

let user, tag, initiative

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  tag = await Tag.createUnique({ name: 'test tag' })
  initiative = await Initiative.create({
    title: 'Initiative test!!',
    description: 'test',
    tags: [tag],
    user
  })
})

describe('pre save', () => {
  it('sets users automatically by user', () => {
    expect(initiative.users).toHaveLength(1)
    expect(initiative.users[0]).toEqual(initiative.user._id)
  })

  it('sets slug automatically by title', () => {
    expect(initiative.slug).toBe('initiative-test')
  })

  it('sets slug by itself', async () => {
    initiative.slug = 'Just a TEST!2!'
    const saved = await initiative.save()
    expect(saved.slug).toBe('just-a-test-2')
  })

  it('sets summary', async () => {
    initiative.summary = 'Just a summary'
    const saved = await initiative.save()
    expect(saved.summary).toBe('Just a summary')
  })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = initiative.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(initiative.id)
    expect(view.title).toBe(initiative.title)
    expect(view.slug).toBe(initiative.slug)
    expect(view.summary).toBe(initiative.summary)
    expect(view.photo).toEqual(initiative.photo)
    expect(Array.isArray(view.tags)).toBe(true)
    expect(typeof view.user).toBe('object')
    expect(view.user).toEqual(user.view())
    expect(Array.isArray(view.users)).toBe(true)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = initiative.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(initiative.id)
    expect(view.title).toBe(initiative.title)
    expect(view.slug).toBe(initiative.slug)
    expect(view.summary).toBe(initiative.summary)
    expect(view.description).toBe(initiative.description)
    expect(view.photo).toEqual(initiative.photo)
    expect(Array.isArray(view.tags)).toBe(true)
    expect(typeof view.user).toBe('object')
    expect(view.user).toEqual(user.view())
    expect(Array.isArray(view.users)).toBe(true)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
