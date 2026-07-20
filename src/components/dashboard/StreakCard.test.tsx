import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StreakCard } from './StreakCard'

describe('StreakCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the study streak heading', async () => {
    render(<StreakCard streak={5} />)
    expect(screen.getByRole('heading', { name: 'Study Streak' })).toBeInTheDocument()
  })

  it('renders the streak count', async () => {
    render(<StreakCard streak={12} />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('day streak')).toBeInTheDocument()
  })

  it('shows active badge for a positive streak', async () => {
    render(<StreakCard streak={1} />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('shows inactive badge for a zero streak', async () => {
    render(<StreakCard streak={0} />)
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })
})
