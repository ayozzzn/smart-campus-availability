import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  DoorClosed,
  CalendarRange,
  Play,
  Users,
  Monitor,
  Building2,
  Info,
} from 'lucide-react';
import {
  DEMO_CASES,
  NOW,
  canBook,
  type Booking,
  type CheckResult,
  type DemoCase,
} from '@/lib/roomAvailability';
import { type Room } from '@/lib/rooms';
import RoomSelector, { fmt } from '@/components/RoomSelector';

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [start, setStart] = useState<string>('660');
  const [end, setEnd] = useState<string>('720');

  const [result, setResult] = useState<CheckResult | null>(null);
  const [demoResults, setDemoResults] = useState<{ c: DemoCase; r: CheckResult }[] | null>(null);

  const bookings: readonly Booking[] = selectedRoom ? selectedRoom.bookings : [];
  const blocked = selectedRoom ? selectedRoom.isBlocked : false;

  const handleCheck = () => {
    if (!selectedRoom) {
      setResult({ kind: 'invalid', message: 'Please select a room first.' });
      return;
    }
    const s = Number(start);
    const e = Number(end);
    if (start.trim() === '' || end.trim() === '' || Number.isNaN(s) || Number.isNaN(e)) {
      setResult({ kind: 'invalid', message: 'Please enter numeric start and end minutes.' });
      return;
    }
    setResult(canBook(s, e, NOW, blocked, bookings));
  };

  const handleDemo = () => {
    if (!selectedRoom) {
      setResult({ kind: 'invalid', message: 'Please select a room first.' });
      return;
    }
    setDemoResults(
      DEMO_CASES.map((c) => ({ c, r: canBook(c.start, c.end, NOW, c.blocked, bookings) }))
    );
    setStart(String(DEMO_CASES[0].start));
    setEnd(String(DEMO_CASES[0].end));
    setResult(canBook(DEMO_CASES[0].start, DEMO_CASES[0].end, NOW, DEMO_CASES[0].blocked, bookings));
  };

  const tone =
    result?.kind === 'available'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : result?.kind === 'unavailable'
      ? 'border-rose-200 bg-rose-50 text-rose-800'
      : result?.kind === 'invalid'
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : 'border-slate-200 bg-slate-50 text-slate-500';

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-slate-100 text-slate-800">
      {/* Decorative top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-500" />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2.5 text-sky-600">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider">Smart Campus</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-800 sm:text-3xl">
            Room Availability Checker
          </h1>
          <p className="mt-2 max-w-lg text-sm text-slate-500">
            Find a room, then check whether a time slot is free. This tool does not create or confirm bookings.
          </p>
        </header>

        {/* Two-column layout on desktop: room finder (left) + booking form (right) */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left column: Room finder + selected room detail */}
          <div className="space-y-6">
            <RoomSelector selectedRoom={selectedRoom} onSelectRoom={setSelectedRoom} />

            {/* Selected room detail */}
            {selectedRoom && (
              <section className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                      <DoorClosed className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Selected room</p>
                      <p className="text-lg font-bold text-slate-800">{selectedRoom.name}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                      selectedRoom.isBlocked
                        ? 'bg-rose-50 text-rose-600 ring-rose-100'
                        : 'bg-emerald-50 text-emerald-600 ring-emerald-100'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${selectedRoom.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    {selectedRoom.isBlocked ? 'Blocked' : 'Available'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
                    <Users className="h-4 w-4 text-sky-400" />
                    <div>
                      <p className="text-xs text-slate-400">Capacity</p>
                      <p className="font-semibold text-slate-700">{selectedRoom.capacity} seats</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
                    <Monitor className="h-4 w-4 text-sky-400" />
                    <div>
                      <p className="text-xs text-slate-400">Equipment</p>
                      <p className="font-semibold capitalize text-slate-700">{selectedRoom.equipment.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
                    <Clock className="h-4 w-4 text-sky-400" />
                    <div>
                      <p className="text-xs text-slate-400">Current time</p>
                      <p className="font-semibold text-slate-700">{NOW} min · {fmt(NOW)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
                    <CalendarRange className="h-4 w-4 text-sky-400" />
                    <div>
                      <p className="text-xs text-slate-400">Existing bookings</p>
                      <p className="font-semibold text-slate-700">
                        {selectedRoom.bookings.length
                          ? selectedRoom.bookings.map(([s, e]) => `${s}–${e}`).join(', ')
                          : 'None'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right column: Time checker form + results + demo */}
          <div className="space-y-6">
            {/* Time checker form */}
            <section className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-sm sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-sky-900">
                <Clock className="h-4 w-4 text-sky-500" />
                Check a time slot
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-slate-600">Start (min after midnight)</span>
                  <input
                    type="number"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                    placeholder="e.g. 660"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-slate-600">End (min after midnight)</span>
                  <input
                    type="number"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                    placeholder="e.g. 720"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  onClick={handleCheck}
                  className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-sky-700 hover:shadow-lg hover:shadow-sky-200 active:scale-[0.98] sm:flex-1 sm:py-2.5"
                >
                  Check availability
                </button>
                <button
                  onClick={handleDemo}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 active:scale-[0.98] sm:flex-1 sm:py-2.5"
                >
                  <Play className="h-4 w-4" />
                  Run demo cases
                </button>
              </div>
              {!selectedRoom && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-600">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  Select a room on the left to enable the availability check.
                </div>
              )}
            </section>

            {/* Result */}
            {result && (
              <section
                className={`flex items-start gap-3 rounded-2xl border p-5 shadow-sm transition ${tone}`}
              >
                {result.kind === 'available' ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                )}
                <div>
                  <p className="text-base font-bold">
                    {result.kind === 'available' ? 'Available' : 'Unavailable'}
                  </p>
                  <p className="mt-0.5 text-sm opacity-90">{result.message}</p>
                </div>
              </section>
            )}

            {/* Demo results */}
            {demoResults && (
              <section className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-sm sm:p-6">
                <h2 className="mb-1 text-sm font-semibold text-sky-900">Demo cases</h2>
                <p className="mb-3 text-xs text-slate-400">
                  Run against {selectedRoom?.name ?? 'the selected room'}'s bookings.
                </p>
                <ul className="space-y-2">
                  {demoResults.map(({ c, r }, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5 text-sm transition hover:border-slate-200"
                    >
                      <div>
                        <p className="font-medium text-slate-700">
                          {c.start}–{c.end}
                          {c.blocked ? ' · blocked' : ''}
                        </p>
                        <p className="text-xs text-slate-500">{c.label}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xs font-semibold ${
                            r.kind === 'available'
                              ? 'text-emerald-600'
                              : r.kind === 'unavailable'
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {r.kind === 'available' ? 'Available' : 'Unavailable'}
                        </p>
                        <p className="max-w-[12rem] text-xs text-slate-400">{r.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Fictional data · Availability check only · No bookings are created
        </footer>
      </div>
    </div>
  );
}
