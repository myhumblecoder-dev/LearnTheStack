import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MonthPage from './page'

vi.mock('@/lib/curriculum/schedule', () => ({
  getCurriculumWithSchedule: vi.fn(),
  formatUtc: () => 'Jun 1',
  monthLabel: () => 'Month 1',
  todayUtc: () => new Date(Date.UTC(2026, 5, 10)),
}))

vi.mock('@/lib/curriculum/weeklyFreshnessQueries', () => ({
  getAllWeeksWithFreshness: vi.fn(),
}))

import { getCurriculumWithSchedule } from '@/lib/curriculum/schedule'
import { getAllWeeksWithFreshness } from '@/lib/curriculum/weeklyFreshnessQueries'

const mockCurriculum = vi.mocked(getCurriculumWithSchedule)
const mockFreshness = vi.mocked(getAllWeeksWithFreshness)

const month = {
  id: 1,
  title: 'Foundations',
  description: 'TS basics',
  isBuffer: false,
  startDate: new Date(Date.UTC(2026, 5, 1)),
  endDate: new Date(Date.UTC(2026, 5, 28)),
  weeks: [
    {
      id: 7,
      weekNum: 1,
      title: 'Types & narrowing',
      startDate: new Date(Date.UTC(2026, 5, 1)),
      endDate: new Date(Date.UTC(2026, 5, 7)),
      topics: [
        { track: 'CORE', progress: { status: 'COMPLETED' } },
      ],
    },
  ],
}

describe('MonthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCurriculum.mockResolvedValue([month] as unknown as Awaited<
      ReturnType<typeof getCurriculumWithSchedule>
    >)
  })

  it('freshness badge appears for a week with COMPLETED topics', async () => {
    mockFreshness.mockResolvedValue([
      {
        weekId: 7,
        weekNum: 1,
        title: 'Types & narrowing',
        startDate: new Date(Date.UTC(2026, 5, 1)),
        endDate: new Date(Date.UTC(2026, 5, 7)),
        freshness: {
          pressure: 0.9,
          freshness: 'fresh',
          completedCount: 1,
          totalCount: 1,
        },
      },
    ] as unknown as Awaited<ReturnType<typeof getAllWeeksWithFreshness>>)

    render(await MonthPage())

    expect(screen.getByText('Fresh')).toBeInTheDocument()
    expect(screen.getByText('90%')).toBeInTheDocument()
  })

  it('no badge rendered when freshness map has no entry', async () => {
    mockFreshness.mockResolvedValue([])

    render(await MonthPage())

    expect(screen.queryByText('Fresh')).not.toBeInTheDocument()
    expect(screen.queryByText('Fading')).not.toBeInTheDocument()
    expect(screen.queryByText('Stale')).not.toBeInTheDocument()
  })
})
