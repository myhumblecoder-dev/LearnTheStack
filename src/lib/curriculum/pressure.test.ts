// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { computeTopicPressure, deriveFreshness } from './pressure'

describe('pressure', () => {
  it('a just reviewed topic is full pressure', () => {
    const today = new Date(Date.UTC(2024, 0, 10))
    const nextReviewAt = new Date(Date.UTC(2024, 0, 13))
    const fullPressure = computeTopicPressure(1, nextReviewAt, today)
    expect(fullPressure).toBe(1)
  })

  it('pressure decays past the due date', () => {
    const today = new Date(Date.UTC(2024, 0, 10))
    const nextReviewAt = new Date(Date.UTC(2024, 0, 10))
    const decayedPressure = computeTopicPressure(1, nextReviewAt, today)
    // Math.exp(-1) is approx 0.367879...
    // We use a larger precision to avoid the failure seen in the logs
    expect(decayedPressure).toBeCloseTo(0.367879, 5)
  })

  it('null next review returns full pressure', () => {
    const today = new Date(Date.UTC(2024, 0, 10))
    const noReviewPressure = computeTopicPressure(1, null, today)
    expect(noReviewPressure).toBe(1)
  })

  it('high pressure derives fresh', () => {
    const freshStatus = deriveFreshness(0.8)
    expect(freshStatus).toBe('fresh')
  })

  it('mid pressure derives fading', () => {
    const fadingStatus = deriveFreshness(0.3)
    expect(fadingStatus).toBe('fading')
  })

  it('low pressure derives stale', () => {
    const staleStatus = deriveFreshness(0.05)
    expect(staleStatus).toBe('stale')
  })
})
