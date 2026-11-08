import type { Booking } from '@/lib/roomAvailability';

export type Equipment = 'projector' | 'whiteboard' | 'video' | 'audio';

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: readonly Equipment[];
  isBlocked: boolean;
  bookings: readonly Booking[];
};

export type RoomFilter = {
  minCapacity?: number;
  equipment?: readonly Equipment[];
};

/**
 * F1. minCapacity: keep rooms whose capacity is >= the requested minimum.
 * F2. equipment: keep rooms that include ALL of the requested equipment items.
 * F3. blocked status: drop rooms that are flagged as blocked.
 *
 * Pure function — does not mutate the input array or any room.
 */
export function filterRooms(
  rooms: readonly Room[],
  { minCapacity, equipment }: RoomFilter
): Room[] {
  return rooms.filter((room) => {
    if (room.isBlocked) return false;
    if (minCapacity !== undefined && room.capacity < minCapacity) return false;
    if (equipment !== undefined && equipment.length > 0) {
      const has = (item: Equipment) => room.equipment.includes(item);
      if (!equipment.every(has)) return false;
    }
    return true;
  });
}

const freeze = (b: [number, number]) => Object.freeze(b) as Booking;

export const ROOMS: readonly Room[] = Object.freeze([
  Object.freeze({
    id: 'a-101',
    name: 'Room A-101',
    capacity: 8,
    equipment: Object.freeze(['projector', 'whiteboard'] as Equipment[]),
    isBlocked: false,
    bookings: Object.freeze([freeze([600, 660]), freeze([720, 800])]) as readonly Booking[],
  }),
  Object.freeze({
    id: 'b-202',
    name: 'Room B-202',
    capacity: 20,
    equipment: Object.freeze(['projector', 'video', 'audio'] as Equipment[]),
    isBlocked: false,
    bookings: Object.freeze([freeze([540, 600]), freeze([900, 960]), freeze([1020, 1080])]) as readonly Booking[],
  }),
  Object.freeze({
    id: 'c-303',
    name: 'Room C-303',
    capacity: 4,
    equipment: Object.freeze(['whiteboard'] as Equipment[]),
    isBlocked: true,
    bookings: Object.freeze([freeze([660, 720])]) as readonly Booking[],
  }),
  Object.freeze({
    id: 'd-404',
    name: 'Room D-404',
    capacity: 12,
    equipment: Object.freeze(['projector', 'whiteboard', 'video', 'audio'] as Equipment[]),
    isBlocked: false,
    bookings: Object.freeze([freeze([480, 540]), freeze([780, 840])]) as readonly Booking[],
  }),
]);
