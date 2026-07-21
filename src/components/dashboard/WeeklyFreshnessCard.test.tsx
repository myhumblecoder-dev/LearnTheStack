import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WeeklyFreshnessCard } from './WeeklyFreshnessCard'

describe('WeeklyFreshnessCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the weekly freshness heading', async () => {
    render(<WeeklyFreshnessCard result={{ pressure: 0.5, freshness: 'fresh', completedCount: 1, totalCount: 2 }} />)
    expect(screen.getByRole('heading', { name: 'Weekly Freshness' })).toBeInTheDocument()
  })

  it('shows the fresh badge for a fresh result', async () => {
    render(<WeeklyFreshnessCard result={{ pressure: 0.9, freshness: 'fresh', completedCount: 5, totalCount: 5 }} />)
    expect(screen.getByText('Fresh')).toBeInTheDocument()
  })

  it('shows the stale badge for a stale result', async () => {
    render(<WeeklyFreshnessCard result={{ pressure: 0.1, freshness: 'stale', completedCount: 0, totalCount: 5 }} />)
    expect(screen.getByText('Stale')).toBeInTheDocument()
  })

  it('renders the completed of total subtitle', async () => {
    render(<WeeklyFreshnessCard result={{ pressure: 0.5, freshness: 'fresh', completedCount: 3, totalCount: 10 }} />)
    expect(screen.getByText('3 of 10 topics completed this week')).toBeInTheDocument()
  })
}) 