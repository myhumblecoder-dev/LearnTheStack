// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { computeStudyStreak } from './streak'

describe('streak', () => {
  it('single session today yields one', () => {
    const today = new Date(Date.UTC(2023, 10, 15))
    const sessions = [new Date(Date.UTC(2023, 10, 15))]
    
    const streak = computeStudyStreak(sessions, today)
    expect(streak).toBe(1)
  })

  it('consecutive days count the run', () => {
    const today = new Date(Date.UTC(2023, 10, 15))
    const sessions = [
      new Date(Date.UTC(2023, 10, 15)),
      new Date(Date.UTC(2023, 10, 14)),
      new Date(Date.UTC(2023, 10, 13)),
    ]
    
    const streak = computeStudyStreak(sessions, today)
    expect(streak).toBe(3)
  })

  it('a gap breaks the streak', () => {
    const today = new Date(Date.UTC(2023, 10, 15))
    const sessions = [
      new Date(Date.UTC(2023, 10, 15)),
      new Date(Date.UTC(2023, 10, 14)),
      // Gap on the 13th
      new Date(Date.UTC(2023, 10, 12)),
    ]
    
    const streak = computeStudyStreak(sessions, today)
    expect(streak).toBe(2)
  })

  it('no session today yields zero', () => {
    const today = new Date(Date.UTC(2023, 10, 15))
    const sessions = [
      new Date(Date.UTC(2023, 10, 14)),
      new Date(Date.UTC(2023, 10, 13)),
    ]
    
    const streak = computeStudyStreak(sessions, today)
    expect(streak).toBe(0)
  })

  it('duplicate sessions same day count once', () => {
    const today = new Date(Date.UTC(2023, 10, 15))
    const sessions = [
      new Date(Date.UTC(2023, 10, 15)),
      new Date(Date.UTC(2023, 10, 15)), // Duplicate
      new Date(Date.UTC(2023, 10, 14)),
    ]
    
    const streak = computeStudyStreak(sessions, today)
    expect(streak).toBe(2)
  })
})
