import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PressureIndicator } from './PressureIndicator'

describe('PressureIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the fresh badge for fresh freshness', async () => {
    render(<PressureIndicator pressure={0.8} freshness="fresh" />)
    expect(screen.getByText('Fresh')).toBeInTheDocument()
  })

  it('renders the fading badge for fading freshness', async () => {
    render(<PressureIndicator pressure={0.5} freshness="fading" />)
    expect(screen.getByText('Fading')).toBeInTheDocument()
  })

  it('renders the stale badge for stale freshness', async () => {
    render(<PressureIndicator pressure={0.2} freshness="stale" />)
    expect(screen.getByText('Stale')).toBeInTheDocument()
  })

  it('renders the pressure percentage', async () => {
    render(<PressureIndicator pressure={0.85} freshness="fresh" />)
    expect(screen.getByText('85%')).toBeInTheDocument()
  })
})
