import { Initiative } from '.'
import { User } from '../user'

let user, initiative

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  initiative = await Initiative.create({ user, title: 'test', photo: 'test', users: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = initiative.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(initiative.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(initiative.title)
    expect(view.photo).toBe(initiative.photo)
    expect(view.users).toBe(initiative.users)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = initiative.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(initiative.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.title).toBe(initiative.title)
    expect(view.photo).toBe(initiative.photo)
    expect(view.users).toBe(initiative.users)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
