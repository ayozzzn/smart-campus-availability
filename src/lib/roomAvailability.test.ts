import { describe, expect, it } from 'vitest';
import { DEFAULT_BOOKINGS, DEMO_CASES, NOW, canBook } from '@/lib/roomAvailability';

const check = (start: number, end: number, blocked = false) =>
  canBook(start, end, NOW, blocked, DEFAULT_BOOKINGS);

describe('past time (AC1)', () => {
  it('rejects a start equal to now', () => {
    expect(check(NOW, 600)).toEqual({
      kind: 'invalid',
      message: `Start must be strictly after now (${NOW}).`,
    });
  });

  it('rejects a start before now', () => {
    expect(check(500, 600).kind).toBe('invalid');
  });

  it('accepts a start one minute after now', () => {
    expect(check(NOW + 1, 600).kind).toBe('available');
  });
});

describe('reversed or empty interval (AC1)', () => {
  it('rejects end before start', () => {
    expect(check(700, 600)).toEqual({
      kind: 'invalid',
      message: 'Start must be earlier than end.',
    });
  });

  it('rejects a zero-length interval', () => {
    expect(check(660, 660).kind).toBe('invalid');
  });
});

describe('duration cap (AC2)', () => {
  it('rejects a 121-minute window', () => {
    expect(check(720, 841)).toEqual({
      kind: 'invalid',
      message: 'Duration is 121 min — max allowed is 120 min.',
    });
  });

  it('accepts a free window of exactly 120 minutes', () => {
    expect(check(840, 960).kind).toBe('available');
  });
});

describe('blocked room (AC3)', () => {
  it('reports a free-looking window as unavailable when the room is blocked', () => {
    expect(check(660, 720, true)).toEqual({
      kind: 'unavailable',
      message: 'Room is flagged as blocked.',
    });
  });
});

describe('overlap (AC4)', () => {
  it('reports a window that overlaps an existing booking as unavailable', () => {
    expect(check(630, 690)).toEqual({
      kind: 'unavailable',
      message: 'Overlaps existing booking 600–660.',
    });
  });
});

describe('touching endpoints (AC4)', () => {
  it('accepts a window that starts exactly when an earlier booking ends and ends exactly when a later one starts', () => {
    expect(check(660, 720).kind).toBe('available');
  });

  it('accepts a window that starts exactly when a booking ends', () => {
    expect(check(800, 860).kind).toBe('available');
  });
});

describe('invalid inputs (AC6)', () => {
  it('never returns available for non-integer minutes', () => {
    expect(check(660.5, 720).kind).toBe('invalid');
  });

  it('never returns available for times beyond the day', () => {
    expect(check(1400, 1441).kind).toBe('invalid');
  });
});

describe('fixtures stay unchanged', () => {
  it('keeps the default bookings as they were', () => {
    expect(DEFAULT_BOOKINGS).toEqual([
      [600, 660],
      [720, 800],
    ]);
  });

  it('does not mutate bookings when checking availability', () => {
    check(660, 720);
    check(630, 690);
    expect(DEFAULT_BOOKINGS).toEqual([
      [600, 660],
      [720, 800],
    ]);
  });

  it('keeps the demo cases as they were', () => {
    expect(DEMO_CASES.map((c) => [c.start, c.end, c.blocked])).toEqual([
      [660, 720, false],
      [630, 690, false],
      [660, 720, true],
      [720, 840, false],
      [720, 841, false],
      [540, 570, false],
    ]);
  });
});
