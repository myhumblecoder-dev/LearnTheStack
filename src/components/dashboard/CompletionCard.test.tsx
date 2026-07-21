import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CompletionCard } from './CompletionCard'
import { CurriculumStats } from "@/lib/curriculum/stats"

describe('CompletionCard', () => {
  const fixture: CurriculumStats = {
    completionPct: 45,
    completed: 9,
    total: 20,
    inProgress: 5,
    notStarted: 6
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the curriculum progress heading', async () => {
    render(<CompletionCard stats={fixture} />)
    expect(screen.getByRole('heading', { name: 'Curriculum Progress' })).toBeInTheDocument()
  })

  it('renders the completion percentage', async () => {
    render(<CompletionCard stats={fixture} />)
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('renders the completed of total summary', async () => {
    render(<CompletionCard stats={fixture} />)
    expect(screen.getByText('9 of 20 topics completed')).toBeInTheDocument()
  })

  it('renders in progress and not started counts', async () => {
    render(<CompletionCard stats={fixture} />)
    expect(screen.getByText('5 in progress')).toBeInTheDocument()
    expect(screen.getByText('6 not started')).toBeInTheDocument()
  })
})
