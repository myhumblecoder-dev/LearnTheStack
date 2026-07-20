// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { computeCurriculumStats, type TopicProgressInput } from './stats'

describe('stats', () => {
  it('empty array yields all-zero stats', () => {
    const stats = computeCurriculumStats([])
    expect(stats).toEqual({
      total: 0,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      completionPct: 0,
    })
  })

  it('counts completed topics', () => {
    const topics: TopicProgressInput[] = [
      { progress: { status: 'COMPLETED' } },
      { progress: { status: 'COMPLETED' } },
      { progress: { status: 'NOT_STARTED' } },
    ]
    const stats = computeCurriculumStats(topics)
    expect(stats.completed).toBe(2)
    expect(stats.total).toBe(3)
  })

  it('counts in progress and quiz pending', () => {
    const topics: TopicProgressInput[] = [
      { progress: { status: 'IN_PROGRESS' } },
      { progress: { status: 'QUIZ_PENDING' } },
      { progress: { status: 'COMPLETED' } },
    ]
    const stats = computeCurriculumStats(topics)
    expect(stats.inProgress).toBe(2)
    expect(stats.completed).toBe(1)
  })

  it('null progress counts as not started', () => {
    const topics: TopicProgressInput[] = [
      { progress: null },
      { progress: { status: 'NOT_STARTED' } },
      { progress: { status: 'COMPLETED' } },
    ]
    const stats = computeCurriculumStats(topics)
    expect(stats.notStarted).toBe(2)
    expect(stats.total).toBe(3)
  })

  it('rounds completion percentage', () => {
    // 1 out of 3 is 33.333...% -> 33
    const topics: TopicProgressInput[] = [
      { progress: { status: 'COMPLETED' } },
      { progress: { status: 'NOT_STARTED' } },
      { progress: { status: 'NOT_STARTED' } },
    ]
    const stats = computeCurriculumStats(topics)
    expect(stats.completionPct).toBe(33)

    // 2 out of 3 is 66.666...% -> 67
    const topics2: TopicProgressInput[] = [
      { progress: { status: 'COMPLETED' } },
      { progress: { status: 'COMPLETED' } },
      { progress: { status: 'NOT_STARTED' } },
    ]
    const stats2 = computeCurriculumStats(topics2)
    expect(stats2.completionPct).toBe(67)
  })

  it('zero topics yields zero percent', () => {
    const stats = computeCurriculumStats([])
    expect(stats.completionPct).toBe(0)
  })
})
