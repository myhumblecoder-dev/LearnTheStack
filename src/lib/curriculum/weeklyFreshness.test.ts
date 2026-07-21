// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { computeWeeklyFreshness } from './weeklyFreshness'
import type { PressureTopic } from '@/lib/curriculum/pressureRollup'

describe('weeklyFreshness', () => {
  const today = new Date(Date.UTC(2024, 0, 10))

  it('two completed fresh topics average to fresh', () => {
    const topics: PressureTopic[] = [
      {
        reviewStage: 1,
        nextReviewAt: null,
        status: 'COMPLETED',
      },
      {
        reviewStage: 1,
        nextReviewAt: null,
        status: 'COMPLETED',
      },
    ]
    const result = computeWeeklyFreshness(topics, today)
    expect(result.pressure).toBe(1)
    expect(result.freshness).toBe('fresh')
    expect(result.completedCount).toBe(2)
    expect(result.totalCount).toBe(2)
  })

  it('a due completed topic is fading and ignores non completed', () => {
    const topics: PressureTopic[] = [
      {
        reviewStage: 1,
        nextReviewAt: new Date(Date.UTC(2024, 0, 10)),
        status: 'COMPLETED',
      },
      {
        reviewStage: 1,
        nextReviewAt: null,
        status: 'NOT_STARTED',
      },
    ]
    const result = computeWeeklyFreshness(topics, today)
    // Math.exp(-1) is approx 0.367879
    expect(result.pressure).toBeCloseTo(0.3679, 4)
    expect(result.freshness).toBe('fading')
    expect(result.completedCount).toBe(1)
    expect(result.totalCount).toBe(2)
  })

  it('empty topics is stale with zero counts', () => {
    const topics: PressureTopic[] = []
    const result = computeWeeklyFreshness(topics, today)
    expect(result.pressure).toBe(0)
    expect(result.freshness).toBe('stale')
    expect(result.completedCount).toBe(0)
    expect(result.totalCount).toBe(0)
  })

  it('a long overdue completed topic is stale', () => {
    const topics: PressureTopic[] = [
      {
        reviewStage: 1,
        nextReviewAt: new Date(Date.UTC(2023, 11, 29)),
        status: 'COMPLETED',
      },
    ]
    const result = computeWeeklyFreshness(topics, today)
    // Math.exp(-5) is approx 0.0067379
    expect(result.pressure).toBeCloseTo(0.006738, 5)
    expect(result.freshness).toBe('stale')
    expect(result.completedCount).toBe(1)
    expect(result.totalCount).toBe(1)
  })
})
