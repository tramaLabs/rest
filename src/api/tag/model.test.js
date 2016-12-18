import { Tag } from '.'

let tag

beforeEach(async () => {
  tag = await Tag.create({ name: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = tag.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(tag.id)
    expect(view.name).toBe(tag.name)
  })

  it('returns full view', () => {
    const view = tag.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(tag.id)
    expect(view.name).toBe(tag.name)
  })
})

describe('increment', () => {
  it('increments tag count', async () => {
    expect(tag.count).toBe(0)
    const tag2 = await Tag.create({ name: 'test2' })
    await Tag.increment([tag])
    expect((await Tag.findById(tag.id)).count).toBe(1)
    await Tag.increment([tag, tag2], 3)
    expect((await Tag.findById(tag.id)).count).toBe(4)
    expect((await Tag.findById(tag2.id)).count).toBe(3)
    await Tag.increment([tag], -1)
    expect((await Tag.findById(tag.id)).count).toBe(3)
  })

  it('returns nothing when tags has no length', async () => {
    expect(await Tag.increment([])).toBeFalsy()
  })
})

describe('createUnique', () => {
  it('does not create duplicated tags', async () => {
    expect(await Tag.find({})).toHaveLength(1)
    await Tag.createUnique({ name: 'Música' })
    await Tag.createUnique({ name: 'musica' })
    expect(await Tag.find({})).toHaveLength(2)
  })
})
