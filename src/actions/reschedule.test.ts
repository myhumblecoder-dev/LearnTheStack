import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rescheduleOverdueTopics } from './reschedule'
import { prisma as db } from '@/lib/db'
import type { RescheduleTopic } from '@/lib/curriculum/reschedule'

// The action passes prisma.topic.findMany({ include: { progress: true } }) rows
// into computeReschedule, which only reads id/scheduledDate/progress — exactly
// RescheduleTopic. Cast the mock return to findMany's payload shape via unknown.
type FindManyResult = Awaited<ReturnType<typeof db.topic.findMany>>

// Mock the database
vi.mock('@/lib/db', () => ({
  prisma: {
    topic: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}))

// We need to control time to make tests deterministic
const MOCK_TODAY = new Date(Date.UTC(2024, 5, 15, 12, 0, 0)) // June 15, 2024

describe('reschedule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(MOCK_TODAY)
  })

  it('updates each overdue topic scheduled date', async () => {
    // Arrange: One topic is overdue (scheduled for June 10) and not completed
    // One topic is completed (should not be in plan)
    const overdueTopic: RescheduleTopic = {
      id: 1,
      scheduledDate: new Date(Date.UTC(2024, 5, 10)),
      progress: { status: 'NOT_STARTED' },
    }

    const completedTopic: RescheduleTopic = {
      id: 2,
      scheduledDate: new Date(Date.UTC(2024, 5, 20)),
      progress: { status: 'COMPLETED' },
    }

    vi.mocked(db.topic.findMany).mockResolvedValue([
      overdueTopic,
      completedTopic,
    ] as unknown as FindManyResult)

    // Act
    await rescheduleOverdueTopics()

    // Assert: The update should be called for the overdue topic
    expect(db.topic.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: expect.objectContaining({
          scheduledDate: expect.any(Date)
        })
      })
    )
  })

  it('returns the rescheduled count', async () => {
    // Arrange: Two overdue topics
    const topic1: RescheduleTopic = {
      id: 1,
      scheduledDate: new Date(Date.UTC(2024, 5, 10)),
      progress: { status: 'NOT_STARTED' },
    }
    const topic2: RescheduleTopic = {
      id: 2,
      scheduledDate: new Date(Date.UTC(2024, 5, 11)),
      progress: { status: 'IN_PROGRESS' },
    }

    vi.mocked(db.topic.findMany).mockResolvedValue([
      topic1,
      topic2,
    ] as unknown as FindManyResult)

    // Act
    const result = await rescheduleOverdueTopics()

    // Assert
    expect(result.rescheduled).toBe(2)
  })

  it('does nothing when on track', async () => {
    // Arrange: All topics are either completed or in the future
    const topic1: RescheduleTopic = {
      id: 1,
      scheduledDate: new Date(Date.UTC(2024, 5, 20)),
      progress: { status: 'NOT_STARTED' },
    }
    const topic2: RescheduleTopic = {
      id: 2,
      scheduledDate: new Date(Date.UTC(2024, 5, 10)),
      progress: { status: 'COMPLETED' },
    }

    vi.mocked(db.topic.findMany).mockResolvedValue([
      topic1,
      topic2,
    ] as unknown as FindManyResult)

    // Act
    const result = await rescheduleOverdueTopics()

    // Assert
    expect(result.rescheduled).toBe(0)
    expect(db.topic.update).not.toHaveBeenCalled()
  })
})