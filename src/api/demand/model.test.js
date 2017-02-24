import { Demand } from '.'
import { User } from '../user'

let user, demand

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  demand = await Demand.create({ creator: user, title: 'test', description: 'test', quantity: 'test', donors: [{}] })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = demand.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(demand.id)
    expect(typeof view.creator).toBe('object')
    expect(view.creator.id).toBe(user.id)
    expect(view.title).toBe(demand.title)
    expect(view.description).toBe(demand.description)
    expect(view.quantity).toBe(demand.quantity)
    expect(Array.isArray(view.donors)).toBe(true)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = demand.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(demand.id)
    expect(typeof view.creator).toBe('object')
    expect(view.creator.id).toBe(user.id)
    expect(view.title).toBe(demand.title)
    expect(view.description).toBe(demand.description)
    expect(view.quantity).toBe(demand.quantity)
    expect(Array.isArray(view.donors)).toBe(true)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
