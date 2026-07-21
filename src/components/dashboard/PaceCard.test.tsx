import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PaceCard } from './PaceCard'
import type { PaceStatus } from "@/lib/curriculum/scheduleStatus"

describe('PaceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the schedule pace heading', async () => {
    const status: PaceStatus = { onTrack: true, overdueCount: 0, daysBehind: 0 }
    render(<PaceCard status={status} />)
    expect(screen.getByRole('heading', { name: 'Schedule Pace' })).toBeInTheDocument()
  })

  it('shows on track for an on track status', async () => {
    const status: PaceStatus = { onTrack: true, overdueCount: 0, daysBehind: 0 }
    render(<PaceCard status={status} />)
    expect(screen.getByText('On track')).toBeInTheDocument()
    expect(screen.getByText("You're on track")).toBeInTheDocument()
  })

  it('shows overdue count when behind', async () => {
    const status: PaceStatus = { onTrack: false, overdueCount: 3, daysBehind: 5 }
    render(<PaceCard status={status} />)
    expect(screen.getByText('3 topics overdue')).toBeInTheDocument()
  })

  it('shows days behind when behind', async () => {
    const status: PaceStatus = { onTrack: false, overdueCount: 3, daysBehind: 5 }
    render(<PaceCard status={status} />)
    expect(screen.getByText('5 days behind')).toBeInTheDocument()
  })
})
