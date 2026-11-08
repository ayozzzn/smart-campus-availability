# Smart Campus Room Availability Checker

Fictional prototype: room catalog (4 rooms), capacity/equipment filtering, and a time-availability checker
(AC1–AC6: valid time, 120-minute maximum, blocked room, overlap rules, immutable bookings, clear responsive feedback).
No login, payments, live APIs or database. All data is in-memory and fictional.

## Setup
```bash
npm install
```
 
## Run
```bash
npm run dev
```
 
## Test
```bash
npm run typecheck
npm test
```
Expected: 2 test files, 28 tests passing (16 regression for AC1–AC6, 12 for room filtering F1–F3).
 
## Structure
- `src/App.tsx` – layout, selectedRoom state, time form, result and demo
- `src/components/RoomSelector.tsx` – capacity/equipment filters, room list, empty state
- `src/lib/rooms.ts` – Room type, frozen 4-room catalog, pure `filterRooms`
- `src/lib/roomAvailability.ts` – unchanged pure rules `canBook`
- `AGENTS.md` – project constraints given to the AI assistant
## Versions
- Initial version: main
- Final version: main
## AI assistant
Bolt.new – see the AI evidence appendix in `A4_Azamatkyzy_Ayazhan_Report.pdf`.# smart-campus-availability
