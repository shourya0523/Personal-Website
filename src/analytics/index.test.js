import { describe, it, expect } from 'vitest'
import { track, setTraits, analyticsEnabled, USER_TYPES, userTypeById } from './index'

describe('analytics', () => {
  it('is a safe no-op without a key', () => {
    expect(analyticsEnabled).toBe(false)
    expect(() => track('x', { a: 1 })).not.toThrow()
    expect(() => setTraits({ user_type: 'peer' })).not.toThrow()
  })
  it('defines four visitor types with a starter app for three of them', () => {
    expect(USER_TYPES.map(t => t.id)).toEqual(['peer', 'recruiter', 'client', 'visitor'])
    expect(userTypeById.recruiter.opens).toBe('resume')
    expect(userTypeById.visitor.opens).toBeNull()
  })
})
