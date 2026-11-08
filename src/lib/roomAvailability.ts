export type Booking = [number, number];

export type CheckResult =
  | { kind: 'available'; message: string }
  | { kind: 'unavailable'; message: string }
  | { kind: 'invalid'; message: string };

export const ROOM = 'Room A-101';
export const NOW = 540;
export const DEFAULT_BOOKINGS: readonly Booking[] = Object.freeze([
  Object.freeze([600, 660]) as Booking,
  Object.freeze([720, 800]) as Booking,
]);

export type DemoCase = {
  label: string;
  start: number;
  end: number;
  blocked: boolean;
};

export const DEMO_CASES: readonly DemoCase[] = Object.freeze([
  { label: '660–720 (gap between bookings)', start: 660, end: 720, blocked: false },
  { label: '630–690 (overlap)', start: 630, end: 690, blocked: false },
  { label: '660–720 with blocked on', start: 660, end: 720, blocked: true },
  { label: '720–840 (exactly 120)', start: 720, end: 840, blocked: false },
  { label: '720–841 (121 min)', start: 720, end: 841, blocked: false },
  { label: '540–570 (starts now)', start: 540, end: 570, blocked: false },
]);

/**
 * Core availability logic. Pure function — does not mutate existing bookings.
 *
 * AC1. 0 <= start < end <= 1440 AND start > now (strictly)
 * AC2. duration (end - start) <= 120
 * AC3. blocked => Unavailable
 * AC4. overlap with existing booking iff (start < e) AND (s < end). Touching OK.
 * AC5. Returns exactly "Available" / "Unavailable" (or an invalid descriptor).
 * AC6. Invalid inputs yield a clear reason, never "Available".
 */
export function canBook(
  start: number,
  end: number,
  now: number,
  blocked: boolean,
  existing: readonly Booking[]
): CheckResult {
  // Integer check (AC6)
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return { kind: 'invalid', message: 'Start and end must be whole minutes (integers).' };
  }

  // Range + ordering (AC1)
  if (start < 0 || end > 1440) {
    return { kind: 'invalid', message: 'Times must be within 0–1440 (a full day).' };
  }
  if (start >= end) {
    return { kind: 'invalid', message: 'Start must be earlier than end.' };
  }
  if (start <= now) {
    return { kind: 'invalid', message: `Start must be strictly after now (${now}).` };
  }

  // Duration cap (AC2)
  const duration = end - start;
  if (duration > 120) {
    return { kind: 'invalid', message: `Duration is ${duration} min — max allowed is 120 min.` };
  }

  // Blocked override (AC3)
  if (blocked) {
    return { kind: 'unavailable', message: 'Room is flagged as blocked.' };
  }

  // Overlap check (AC4)
  for (const [s, e] of existing) {
    if (start < e && s < end) {
      return {
        kind: 'unavailable',
        message: `Overlaps existing booking ${s}–${e}.`,
      };
    }
  }

  return { kind: 'available', message: 'Room is free for this window.' };
}
