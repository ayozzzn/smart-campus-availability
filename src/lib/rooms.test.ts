import { describe, expect, it } from 'vitest';
import { ROOMS, filterRooms } from '@/lib/rooms';

describe('filterRooms — capacity (F1)', () => {
  it('keeps rooms at or above the minimum capacity and drops smaller rooms', () => {
    const result = filterRooms(ROOMS, { minCapacity: 12 });
    expect(result.map((r) => r.id)).toEqual(['b-202', 'd-404']);
  });

  it('returns all non-blocked rooms when no minimum is given', () => {
    const result = filterRooms(ROOMS, {});
    expect(result.map((r) => r.id)).toEqual(['a-101', 'b-202', 'd-404']);
  });
});

describe('filterRooms — equipment (F2)', () => {
  it('keeps only rooms that have a single requested equipment item', () => {
    const result = filterRooms(ROOMS, { equipment: ['video'] });
    expect(result.map((r) => r.id)).toEqual(['b-202', 'd-404']);
  });

  it('keeps rooms with a whiteboard', () => {
    const result = filterRooms(ROOMS, { equipment: ['whiteboard'] });
    expect(result.map((r) => r.id)).toEqual(['a-101', 'd-404']);
  });

  it('keeps only rooms that have ALL selected items (projector + whiteboard)', () => {
    const result = filterRooms(ROOMS, { equipment: ['projector', 'whiteboard'] });
    expect(result.map((r) => r.id)).toEqual(['a-101', 'd-404']);
  });

  it('keeps only rooms that have projector, video, and audio', () => {
    const result = filterRooms(ROOMS, { equipment: ['projector', 'video', 'audio'] });
    expect(result.map((r) => r.id)).toEqual(['b-202', 'd-404']);
  });

  it('drops rooms missing any one of the selected items', () => {
    const result = filterRooms(ROOMS, { equipment: ['whiteboard', 'video'] });
    expect(result.map((r) => r.id)).toEqual(['d-404']);
  });

  it('treats an empty equipment array as "no equipment filter"', () => {
    const result = filterRooms(ROOMS, { equipment: [] });
    expect(result.map((r) => r.id)).toEqual(['a-101', 'b-202', 'd-404']);
  });
});

describe('filterRooms — blocked status (F3)', () => {
  it('drops blocked rooms even when they would otherwise match', () => {
    const result = filterRooms(ROOMS, { minCapacity: 4, equipment: ['whiteboard'] });
    expect(result.map((r) => r.id)).toEqual(['a-101', 'd-404']);
  });

  it('never includes a blocked room regardless of filter', () => {
    const result = filterRooms(ROOMS, {});
    expect(result.some((r) => r.isBlocked)).toBe(false);
  });
});

describe('ROOMS catalog integrity', () => {
  it('contains exactly four rooms with stable ids', () => {
    expect(ROOMS.map((r) => r.id)).toEqual(['a-101', 'b-202', 'c-303', 'd-404']);
  });

  it('does not mutate the catalog when filtering', () => {
    filterRooms(ROOMS, { minCapacity: 10, equipment: ['audio'] });
    expect(ROOMS.map((r) => r.id)).toEqual(['a-101', 'b-202', 'c-303', 'd-404']);
  });
});
