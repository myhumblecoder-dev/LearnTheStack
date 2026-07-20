// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { aggregatePressure, type PressureTopic } from './pressureRollup'

describe('pressureRollup', () => {
  const today = new Date(Date.UTC(2024, 0, 1));

  it('averages the completed topics pressures', () => {
    const topic1: PressureTopic = {
      reviewStage: 1,
      nextReviewAt: new Date(Date.UTC(2024, 0, 1)),
      status: 'COMPLETED'
    };
    const topic2: PressureTopic = {
      reviewStage: 1,
      nextReviewAt: null,
      status: 'COMPLETED'
    };

    const topics: PressureTopic[] = [topic1, topic2];
    const result = aggregatePressure(topics, today);

    // (0.3679 + 1) / 2 = 0.68395
    expect(result).toBeCloseTo(0.6839, 4);
  });

  it('ignores non completed topics', () => {
    const completedTopic: PressureTopic = {
      reviewStage: 1,
      nextReviewAt: null,
      status: 'COMPLETED'
    };
    const incompleteTopic: PressureTopic = {
      reviewStage: 1,
      nextReviewAt: null,
      status: 'IN_PROGRESS'
    };

    const topics: PressureTopic[] = [completedTopic, incompleteTopic];
    const result = aggregatePressure(topics, today);

    expect(result).toBe(1);
  });

  it('no completed topics returns zero', () => {
    const topics: PressureTopic[] = [
      { reviewStage: 1, nextReviewAt: null, status: 'NOT_STARTED' }
    ];

    const result = aggregatePressure(topics, today);
    expect(result).toBe(0);

    const resultEmpty = aggregatePressure([], today);
    expect(resultEmpty).toBe(0);
  });

  it('a fresh completed topic is near full pressure', () => {
    const freshTopic: PressureTopic = {
      reviewStage: 1,
      nextReviewAt: null,
      status: 'COMPLETED'
    };

    const result = aggregatePressure([freshTopic], today);
    expect(result).toBeCloseTo(1, 4);
  });
});