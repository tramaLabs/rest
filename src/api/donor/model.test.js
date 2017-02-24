import { Donor } from '.'
import { User } from '../user'

let user, donor

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  donor = await Donor.create({ user, quantity: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = donor.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(donor.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.quantity).toBe(donor.quantity)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = donor.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(donor.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.quantity).toBe(donor.quantity)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
