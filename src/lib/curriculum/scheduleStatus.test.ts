// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { computeScheduleStatus, type ScheduleTopic } from './scheduleStatus'

describe('scheduleStatus', () => {
  const today = new Date(Date.UTC(2024, 5, 15)); // June 15, 2024

  it('all completed topics are on track', () => {
    const topics: ScheduleTopic[] = [
      {
        scheduledDate: new Date(Date.UTC(2024, 5, 10)),
        progress: { status: 'COMPLETED' }
      },
      {
        scheduledDate: new Date(Date.UTC(2024, 5, 14)),
        progress: { status: 'COMPLETED' }
      }
    ];

    const status = computeScheduleStatus(topics, today);
    expect(status.overdueCount).toBe(0);
    expect(status.onTrack).toBe(true);
    expect(status.daysBehind).toBe(0);
  });

  it('a past incomplete topic is overdue', () => {
    const topics: ScheduleTopic[] = [
      {
        scheduledDate: new Date(Date.UTC(2024, 5, 10)),
        progress: { status: 'IN_PROGRESS' }
      }
    ];

    const status = computeScheduleStatus(topics, today);
    expect(status.overdueCount).toBe(1);
    expect(status.onTrack).toBe(false);
  });

  it('today and future topics are not overdue', () => {
    const topics: ScheduleTopic[] = [
      {
        scheduledDate: new Date(Date.UTC(2024, 5, 15)),
        progress: { status: 'NOT_STARTED' }
      },
      {
        scheduledDate: new Date(Date.UTC(2024, 5, 20)),
        progress: { status: 'NOT_STARTED' }
      },
      {
        scheduledDate: null,
        progress: { status: 'NOT_STARTED' }
      }
    ];

    const status = computeScheduleStatus(topics, today);
    expect(status.overdueCount).toBe(0);
    expect(status.onTrack).toBe(true);
  });

  it('days behind counts from the oldest overdue', () => {
    const topics: ScheduleTopic[] = [
      {
        scheduledDate: new Date(Date.UTC(2024, 5, 10)),
        progress: { status: 'IN_PROGRESS' }
      },
      {
        scheduledDate: new Date(Date.UTC(2024, 5, 12)),
        progress: { status: 'NOT_STARTED' }
      }
    ];

    const status = computeScheduleStatus(topics, today);
    // June 15 - June 10 = 5 days
    expect(status.daysBehind).toBe(5);
  });

  it('empty topics list is on track', () => {
    const status = computeScheduleStatus([], today);
    expect(status.overdueCount).toBe(0);
    expect(status.onTrack).toBe(true);
    expect(status.daysBehind).toBe(0);
  });
});