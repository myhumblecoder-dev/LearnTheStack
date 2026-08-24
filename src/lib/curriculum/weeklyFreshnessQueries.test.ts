import { describe, it, expect, vi } from 'vitest'
import { prisma } from '@/lib/db'
import type { Week } from '@/generated/prisma/client'
import { getAllWeeksWithFreshness } from './weeklyFreshnessQueries'

vi.mock('@/lib/db', () => ({
  prisma: {
    month: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    week: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    topic: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    resource: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    topicProgress: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    quizAttempt: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    chatMessage: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: intoMock(), count: vi.fn() },
    messageFeedback: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    studySession: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
  },
}))

function intoMock() { return vi.fn() }

const makeWeek = (overrides: Partial<Week> = {}): Week =>
  ({
    id: 0,
    monthId: 0,
    weekNum: 0,
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    ...overrides,
  } as unknown as Week)

describe('weeklyFreshnessQueries', () => {
  const mockFindMany = vi.mocked(prisma.week.findMany)

  it('single completed topic returns fresh row', async () => {
    const today = new Date(Date.UTC(2024, 0, 10))
    const fixture = {
      ...makeWeek({
        id: 1,
        weekNum: 1,
        title: 'W1',
        startDate: new Date(Date.UTC(2024, 0, 8)),
        endDate: new Date(Date.UTC(2024, 0, 14)),
      }),
      topics: [
        {
          id: 101,
          title: 'Topic 1',
          progress: { reviewStage: 1, nextReviewAt: null, status: 'COMPLETED' },
        },
      ],
    } as unknown as Awaited<ReturnType<typeof prisma.week.findMany>>[number]

    mockFindMany.mockResolvedValue([fixture])

    const rows = await getAllWeeksWithFreshness(today)
    const row = rows[0]

    expect(row.weekId).toBe(1)
    expect(row.freshness.pressure).toBe(1)
    expect(row.freshness.freshness).toBe('fresh')
    expect(row.freshness.completedCount).toBe(1)
    expect(row.freshness.totalCount).toBe(1)
  })

  it('empty week returns stale row', async () => {
    const today = new Date(Date.UTC(2024, 0, 10))
    const fixture = {
      ...makeWeek({
        id: 2,
        weekNum: 2,
        title: 'W2',
        startDate: new Date(Date.UTC(2024, 0, 15)),
        endDate: new Date(Date.UTC(2024, 0, 21)),
      }),
      topics: [],
    } as unknown as Awaited<ReturnType<typeof prisma.week.findMany>>[number]

    mockFindMany.mockResolvedValue([fixture])

    const rows = await getAllWeeksWithFreshness(today)
    const row = rows[0]

    expect(row.weekId).toBe(2)
    expect(row.freshness.pressure).toBe(0)
    expect(row.freshness.freshness).toBe('stale')
    expect(row.freshness.completedCount).toString()
    expect(row.freshness.completedCount).toBe(0)
    expect(row.freshness.totalCount).toBe(0)
  })

  it('findMany called with orderBy startDate asc', async () => {
    mockFindMany.mockResolvedValue([])
    await getAllWeeksWithFreshness(new Date(Date.UTC(2024, 0, 10)))
    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { startDate: 'asc' } }))
  })
})
