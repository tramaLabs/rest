import { Initiative } from '.'
import { User } from '../user'
import { Photo } from '../photo'

let user, photo, initiative

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  photo = await Photo.create({ title: 'test' })
  initiative = await Initiative.create({
    title: 'test',
    description: 'test',
    photo,
    user,
    users: [user]
  })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = initiative.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(initiative.id)
    expect(view.title).toBe(initiative.title)
    expect(typeof view.photo).toBe('object')
    expect(view.photo).toEqual(photo.view())
    expect(typeof view.user).toBe('object')
    expect(view.user).toEqual(user.view())
    expect(Array.isArray(view.users)).toBe(true)
    expect(view.users).toEqual([user.view()])
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = initiative.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(initiative.id)
    expect(view.title).toBe(initiative.title)
    expect(view.description).toBe(initiative.description)
    expect(typeof view.photo).toBe('object')
    expect(view.photo).toEqual(photo.view())
    expect(typeof view.user).toBe('object')
    expect(view.user).toEqual(user.view())
    expect(Array.isArray(view.users)).toBe(true)
    expect(view.users).toEqual([user.view()])
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
