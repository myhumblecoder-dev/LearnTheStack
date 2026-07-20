import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rescheduleOverdueTopics } from './reschedule'
import { prisma as db } from '@/lib/db'
import type { Topic } from '@prisma/client'

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
    const overdueTopic: Partial<Topic> = {
      id: 1,
      scheduledDate: new Date(Date.UTC(2024, 5, 10)),
      progress: { status: 'NOT_STARTED' as const },
    }
    
    const completedTopic: Partial<Topic> = {
      id: 2,
      scheduledDate: new Date(Date.UTC(2024, 5, 20)),
      progress: { status: 'COMPLETED' as const },
    }

    vi.mocked(db.topic.findMany).mockResolvedValue([
      overdueTopic as Topic,
      completedTopic as Topic,
    ] as Topic[])

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
    const topic1: Partial<Topic> = {
      id: 1,
      scheduledDate: new Date(Date.UTC(2024, 5, 10)),
      progress: { status: 'NOT_STARTED' as const },
    }
    const topic2: Partial<Topic> = {
      id: 2,
      scheduledDate: new Date(Date.UTC(2024, 5, 11)),
      progress: { status: 'IN_PROGRESS' as const },
    }

    vi.mocked(db.topic.findMany).mockResolvedValue([
      topic1 as Topic,
      topic2 as Topic,
    ] as Topic[])

    // Act
    const result = await rescheduleOverdueTopics()

    // Assert
    expect(result.rescheduled).toBe(2)
  })

  it('does nothing when on track', async () => {
    // Arrange: All topics are either completed or in the future
    const topic1: Partial<Topic> = {
      id: 1,
      scheduledDate: new Date(Date.UTC(2024, 5, 20)),
      progress: { status: 'NOT_STARTED' as const },
    }
    const topic2: Partial<Topic> = {
      id: 2,
      scheduledDate: new Date(Date.UTC(2024, 5, 10)),
      progress: { status: 'COMPLETED' as const },
    }

    vi.mocked(db.topic.findMany).mockResolvedValue([
      topic1 as Topic,
      topic2 as Topic,
    ] as Topic[])

    // Act
    const result = await rescheduleOverdueTopics()

    // Assert
    expect(result.rescheduled).toBe(0)
    expect(db.topic.update).not.toHaveBeenCalled()
  })
})