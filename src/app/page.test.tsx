import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Page from './page'

// next/font's loader only exists inside the Next build; under vitest
// `Geist(...)` is not a function and the suite dies at module load.
vi.mock('next/font/google', () => new Proxy({}, {
  get: () => () => ({ variable: 'mock-font-variable', className: 'mock-font' }),
}))

// Child components are (async) server components — unmocked they
// crash the jsdom render and no assertion can ever pass. Keep ALL
// of these mocks.
vi.mock('@/components/dashboard/CurrentTopic', () => ({ CurrentTopic: () => <div data-testid="current-topic" /> }))
vi.mock('@/components/dashboard/ProgressOverview', () => ({ ProgressOverview: () => <div data-testid="progress-overview" /> }))
vi.mock('@/components/dashboard/StreakSection', () => ({ StreakSection: () => <div data-testid="streak-section" /> }))
vi.mock('@/components/dashboard/MonthProgress', () => ({ MonthProgress: () => <div data-testid="month-progress" /> }))
vi.mock('@/components/dashboard/RecentQuizzes', () => ({ RecentQuizzes: () => <div data-testid="recent-quizzes" /> }))
vi.mock('@/components/schedule/DueReviews', () => ({ DueReviews: () => <div data-testid="due-reviews" /> }))
vi.mock('@/components/dashboard/PaceSection', () => ({ PaceSection: () => <div data-testid="pace-section" /> }))
vi.mock('@/components/dashboard/PressureSection', () => ({ PressureSection: () => <div data-testid="pressure-section" /> }))
vi.mock('@/components/dashboard/ThisWeekFreshnessSection', () => ({ default: () => <div data-testid="this-week-freshness-section" /> }))

describe('Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('dashboard page renders ThisWeekFreshnessSection after PressureSection', async () => {
    render(<Page />)
    
    const pressureSection = screen.getByTestId('pressure-section')
    const freshnessSection = screen.getByTestId('this-week-freshness-section')
    
    expect(pressureSection).toBeInTheDocument()
    expect(freshnessSection).toBeInTheDocument()
    
    const container = pressureSection.parentElement
    const elements = container?.querySelectorAll('[data-testid="pressure-section"], [data-testid="this-week-freshness-section"]')
    
    // In the DOM, PressureSection is a sibling of the div containing FreshnessSection
    // or they are siblings in the same parent. We check the order of appearance in the document.
    const allElements = Array.from(document.querySelectorAll('[data-testid="pressure-section"], [data-testid="this-week-freshness-section"]'))
    const pressureIdx = allElements.findIndex(el => el.getAttribute('data-testid') === 'pressure-section')
    const freshnessIdx = allElements.findIndex(el => el.getAttribute('data-testid') === 'this-week-freshness-section')
    
    expect(pressureIdx).toBeLessThan(freshnessIdx)
  })
})
