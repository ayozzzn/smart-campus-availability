import { useMemo, useState } from 'react';
import {
  Users,
  Monitor,
  CheckCircle2,
  XCircle,
  Lock,
  Search,
  Projector,
  PenLine,
  Video,
  Volume2,
  DoorClosed,
} from 'lucide-react';
import { ROOMS, filterRooms, type Equipment, type Room } from '@/lib/rooms';

const EQUIPMENT_OPTIONS: { key: Equipment; label: string; icon: typeof Projector }[] = [
  { key: 'projector', label: 'Projector', icon: Projector },
  { key: 'whiteboard', label: 'Whiteboard', icon: PenLine },
  { key: 'video', label: 'Video', icon: Video },
  { key: 'audio', label: 'Audio', icon: Volume2 },
];

const EQUIPMENT_ICONS: Record<Equipment, typeof Projector> = {
  projector: Projector,
  whiteboard: PenLine,
  video: Video,
  audio: Volume2,
};

export function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

type Props = {
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
};

export default function RoomSelector({ selectedRoom, onSelectRoom }: Props) {
  const [minCapacity, setMinCapacity] = useState<string>('');
  const [equipment, setEquipment] = useState<Set<Equipment>>(new Set());

  const toggleEquipment = (key: Equipment) => {
    setEquipment((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const matched = useMemo<Room[]>(() => {
    const capNum = Number(minCapacity);
    const filter: { minCapacity?: number; equipment?: Equipment[] } = {};
    if (minCapacity.trim() !== '' && !Number.isNaN(capNum)) {
      filter.minCapacity = capNum;
    }
    if (equipment.size > 0) {
      filter.equipment = [...equipment];
    }
    return filterRooms(ROOMS, filter);
  }, [minCapacity, equipment]);

  const activeEquipment = [...equipment];

  return (
    <section className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-lg shadow-sky-100/40 backdrop-blur-sm sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-sky-900">
        <Search className="h-4 w-4 text-sky-500" />
        Find a room
      </h2>

      {/* Filters */}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-slate-600">Minimum capacity</span>
          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              type="number"
              min={0}
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              placeholder="e.g. 8"
            />
          </div>
        </label>

        <fieldset className="text-sm">
          <legend className="mb-1.5 block font-medium text-slate-600">Equipment</legend>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map(({ key, label, icon: Icon }) => {
              const checked = equipment.has(key);
              return (
                <label
                  key={key}
                  className={`group inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    checked
                      ? 'border-sky-300 bg-sky-50 text-sky-700 shadow-sm shadow-sky-100'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:bg-sky-50/40'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${checked ? 'text-sky-500' : 'text-slate-400'}`} />
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleEquipment(key)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Results */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="mb-3 text-xs font-medium text-slate-500">
          <span className="text-sky-700">{matched.length}</span> room{matched.length === 1 ? '' : 's'} match
          {activeEquipment.length > 0 ? ` · ${activeEquipment.join(', ')}` : ''}
          {minCapacity.trim() !== '' && !Number.isNaN(Number(minCapacity))
            ? ` · ≥${minCapacity} seats`
            : ''}
        </p>

        {matched.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <XCircle className="h-6 w-6 text-slate-300" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-500">No rooms match your criteria</p>
            <p className="mt-1 text-xs text-slate-400">Try adjusting the filters above</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {matched.map((room) => {
              const isSelected = selectedRoom?.id === room.id;
              return (
                <li key={room.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRoom(room)}
                    className={`group w-full rounded-2xl border p-4 text-left transition duration-200 ${
                      isSelected
                        ? 'border-sky-400 bg-sky-50/60 shadow-md shadow-sky-100 ring-2 ring-sky-200'
                        : 'border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/30 hover:shadow-md hover:shadow-sky-100/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                            isSelected
                              ? 'bg-sky-100 text-sky-600'
                              : 'bg-slate-100 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-500'
                          }`}
                        >
                          <DoorClosed className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{room.name}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                            <Users className="h-3 w-3" />
                            {room.capacity} seats
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {room.isBlocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 ring-1 ring-rose-100">
                            <Lock className="h-3 w-3" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 ring-1 ring-emerald-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Available
                          </span>
                        )}
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-sky-500" />}
                      </div>
                    </div>

                    {/* Equipment pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {room.equipment.map((eq) => {
                        const Icon = EQUIPMENT_ICONS[eq];
                        return (
                          <span
                            key={eq}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-500"
                          >
                            {Icon && <Icon className="h-3 w-3 text-slate-400" />}
                            {eq}
                          </span>
                        );
                      })}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
