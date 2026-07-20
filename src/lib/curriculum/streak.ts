import { sameUtcDay, addDays } from "@/lib/curriculum/schedule"

/**
 * Computes the current consecutive-day study streak from a list of study-session dates.
 * 
 * @param sessionDates - An array of dates representing when study sessions occurred.
 * @param today - The reference date to check the streak from.
 * @returns The number of consecutive days (including today) that have at least one session.
 */
export function computeStudyStreak(sessionDates: Date[], today: Date): number {
  if (sessionDates.length === 0) {
    return 0
  }

  // Check if there is at least one session on the 'today' date.
  const hasSessionToday = sessionDates.some((date) => sameUtcDay(date, today))

  if (!hasSessionToday) {
    return 0
  }

  let streakCount = 0
  let currentCheckDate = new Date(today.getTime())

  // Walk backwards one UTC day at a time
  while (true) {
    const hasSessionOnDay = sessionDates.some((date) => sameUtcDay(date, currentCheckDate))

    if (hasSessionOnDay) {
      streakCount++
      // Move to the previous day
      currentCheckDate = addDays(currentCheckDate, -1)
    } else {
      // Stop at the first day with no matching session
      break
    }
  }

  return streakCount
}