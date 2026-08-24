import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WeekFreshnessBadge } from './WeekFreshnessBadge'

// Do NOT vi.mock @/lib/curriculum/pressure — pure module(s), no I/O.
// Render them for real; mocking a collaborator makes the test assert against
// its own mock and pass whatever the component does.

describe('WeekFreshnessBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fresh badge shows Fresh text and 90% pressure', async () => {
    render(<WeekFreshnessBadge {...({ freshness: 'fresh' as const, pressure: 0.9 })} />)
    expect(screen.getByText('Fresh')).toBeInTheDocument()
    expect(screen.getByText('90%')).toBeInTheDocument()
  })

  it('fading badge shows Fading text and 30% pressure', async () => {
    render(<WeekFreshnessBadge {...({ freshness: 'fading' as const, pressure: 0.3 })} />)
    expect(screen.getByText('Fading')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('stale badge shows Stale text and 5% pressure', async () => {
    render(<WeekFreshnessBadge {...({ freshness: 'stale' as const, pressure: 0.05 })} />)
    expect(screen.getByText('Stale')).toBeInTheDocument()
    expect(screen.getByText('5%')).toBeInTheDocument()
  })
})
