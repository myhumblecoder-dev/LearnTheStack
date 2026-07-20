// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { computeReschedule, type RescheduleTopic } from './reschedule'

describe('reschedule', () => {
  it('an on track set returns empty', () => {
    const today = new Date(Date.UTC(2024, 0, 10))
    const topics: RescheduleTopic[] = [
      {
        id: 1,
        scheduledDate: new Date(Date.UTC(2024, 0, 15)),
        progress: { status: 'NOT_STARTED' }
      }
    ]
    
    const result = computeReschedule(topics, today)
    expect(result).toEqual([])
  })

  it('shifts incomplete topics by days behind', () => {
    // To trigger 'behind', we need an overdue topic.
    // If topic 1 is scheduled for Jan 1 and today is Jan 10, daysBehind is 9.
    const today = new Date(Date.UTC(2024, 0, 10))
    const overdueDate = new Date(Date.UTC(2024, 0, 1))
    const futureDate = new Date(Date.UTC(2024, 0, 15))
    
    const topics: RescheduleTopic[] = [
      {
        id: 1,
        scheduledDate: overdueDate,
        progress: { status: 'NOT_STARTED' }
      },
      {
        id: 2,
        scheduledDate: futureDate,
        progress: { status: 'NOT_STARTED' }
      }
    ]

    const result = computeReschedule(topics, today)
    
    // daysBehind = 9 (Jan 10 - Jan 1)
    // Topic 1: Jan 1 + 9 days = Jan 10
    // Topic 2: Jan 15 + 9 days = Jan 24
    expect(result).toHaveLength(2)
    expect(result).toContainEqual({
      topicId: 1,
      newScheduledDate: new Date(Date.UTC(2024, 0, 10))
    })
    expect(result).toContainEqual({
      topicId: 2,
      newScheduledDate: new Date(Date.UTC(2024, 0, 24))
    })
  })

  it('excludes completed topics', () => {
    const today = new Date(Date.UTC(2024, 0, 10))
    const overdueDate = new Date(Date.UTC(2024, 0, 1))
    
    const topics: RescheduleTopic[] = [
      {
        id: 1,
        scheduledDate: overdueDate,
        progress: { status: 'COMPLETED' }
      },
      {
        id: 2,
        scheduledDate: overdueDate,
        progress: { status: 'NOT_STARTED' }
      }
    ]

    const result = computeReschedule(topics, today)
    
    // Only topic 2 should be in the result
    expect(result).toHaveLength(1)
    expect(result[0].topicId).toBe(2)
  })

  it('excludes null scheduled dates', () => {
    const today = new Date(Date.UTC(2024, 0, 10))
    const overdueDate = new Date(Date.UTC(2024, 0, 1))
    
    const topics: RescheduleTopic[] = [
      {
        id: 1,
        scheduledDate: null,
        progress: { status: 'NOT_STARTED' }
      },
      {
        id: 2,
        scheduledDate: overdueDate,
        progress: { status: 'NOT_STARTED' }
      }
    ]

    const result = computeReschedule(topics, today)
    
    // Only topic 2 should be in the result
    expect(result).toHaveLength(1)
    expect(result[0].topicId).toBe(2)
  })
})
