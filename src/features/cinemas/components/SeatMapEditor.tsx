import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Armchair,
  Accessibility,
  Crown,
  Info,
} from 'lucide-react';
import type { SeatInsert, SeatType } from '../../../types';

interface LocalSeat {
  row_label: string;
  seat_number: string;
  seat_type: SeatType;
}

interface Props {
  cinemaId: string;
  initialSeats: LocalSeat[];
  onSave: (seats: SeatInsert[]) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}

const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

export const SeatMapEditor: React.FC<Props> = ({
  cinemaId,
  initialSeats,
  onSave,
  isLoading,
  onClose,
}) => {
  const [seats, setSeats] = useState<LocalSeat[]>(initialSeats);
  const [showGenerator, setShowGenerator] = useState(initialSeats.length === 0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generator form state
  const [genRows, setGenRows] = useState(6);
  const [genCols, setGenCols] = useState(10);
  const [genVipRows, setGenVipRows] = useState<string[]>(['E', 'F']);
  const [genAccessibleRow, setGenAccessibleRow] = useState<string>('A');

  // Group seats by row
  const rowMap = useMemo(() => {
    const map = new Map<string, LocalSeat[]>();
    // Sort seats by row and then by seat number numerically
    const sorted = [...seats].sort((a, b) => {
      if (a.row_label !== b.row_label) {
        return a.row_label.localeCompare(b.row_label);
      }
      const numA = parseInt(a.seat_number.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.seat_number.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });

    sorted.forEach((seat) => {
      const existing = map.get(seat.row_label) || [];
      existing.push(seat);
      map.set(seat.row_label, existing);
    });
    return map;
  }, [seats]);

  // Statistics
  const stats = useMemo(() => {
    const total = seats.length;
    const regular = seats.filter((s) => s.seat_type === 'regular').length;
    const premium = seats.filter((s) => s.seat_type === 'premium').length;
    const accessible = seats.filter((s) => s.seat_type === 'accessible').length;
    return { total, regular, premium, accessible };
  }, [seats]);

  // Toggle seat type
  const handleToggleSeatType = (rowLabel: string, seatNum: string) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.row_label === rowLabel && s.seat_number === seatNum) {
          const nextType: Record<SeatType, SeatType> = {
            regular: 'premium',
            premium: 'accessible',
            accessible: 'regular',
          };
          return { ...s, seat_type: nextType[s.seat_type] };
        }
        return s;
      })
    );
  };

  // Remove individual seat
  const handleRemoveSeat = (rowLabel: string, seatNum: string) => {
    setSeats((prev) =>
      prev.filter((s) => !(s.row_label === rowLabel && s.seat_number === seatNum))
    );
  };

  // Set whole row type
  const handleSetRowType = (rowLabel: string, type: SeatType) => {
    setSeats((prev) =>
      prev.map((s) => (s.row_label === rowLabel ? { ...s, seat_type: type } : s))
    );
  };

  // Remove entire row
  const handleDeleteRow = (rowLabel: string) => {
    setSeats((prev) => prev.filter((s) => s.row_label !== rowLabel));
  };

  // Add a seat to row
  const handleAddSeatToRow = (rowLabel: string) => {
    const rowSeats = rowMap.get(rowLabel) || [];
    const maxNum = rowSeats.reduce((max, s) => {
      const n = parseInt(s.seat_number.replace(/\D/g, ''), 10) || 0;
      return n > max ? n : max;
    }, 0);
    const newNum = `${rowLabel}${maxNum + 1}`;
    setSeats((prev) => [
      ...prev,
      { row_label: rowLabel, seat_number: newNum, seat_type: 'regular' },
    ]);
  };

  // Generate complete layout
  const handleGenerateLayout = () => {
    const generated: LocalSeat[] = [];
    for (let r = 0; r < genRows; r++) {
      const rowLetter = ROW_LETTERS[r] || `R${r + 1}`;
      let defaultType: SeatType = 'regular';
      if (genVipRows.includes(rowLetter)) {
        defaultType = 'premium';
      }

      for (let c = 1; c <= genCols; c++) {
        let type: SeatType = defaultType;
        if (rowLetter === genAccessibleRow && (c === 1 || c === genCols)) {
          type = 'accessible';
        }
        generated.push({
          row_label: rowLetter,
          seat_number: `${rowLetter}${c}`,
          seat_type: type,
        });
      }
    }
    setSeats(generated);
    setShowGenerator(false);
  };

  const handleSave = async () => {
    const payload: SeatInsert[] = seats.map((s) => ({
      cinema_id: cinemaId,
      row_label: s.row_label,
      seat_number: s.seat_number,
      seat_type: s.seat_type,
    }));

    await onSave(payload);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const sortedRows = Array.from(rowMap.keys()).sort();

  return (
    <div className="space-y-6">
      {/* Top Controls & Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-slate-400 font-medium">Total:</span>
            <span className="text-white font-bold">{stats.total}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-700/60 rounded-xl text-slate-300">
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
            <span>Regular: {stats.regular}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-amber-500/30 rounded-xl text-amber-300">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>VIP / Premium: {stats.premium}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-blue-500/30 rounded-xl text-blue-300">
            <Accessibility className="w-3 h-3 text-blue-400" />
            <span>Accessible: {stats.accessible}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGenerator(!showGenerator)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{showGenerator ? 'Hide Generator' : 'Auto Generator'}</span>
          </button>

          <button
            type="button"
            disabled={isLoading || seats.length === 0}
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition-all cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Layout</span>
            )}
          </button>
        </div>
      </div>

      {/* Auto Generator Panel */}
      {showGenerator && (
        <div className="p-4 bg-slate-900/90 border border-amber-500/20 rounded-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Auditorium Layout Generator
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Generates a standard hall seat grid in 1 click
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Number of Rows</label>
              <input
                type="number"
                min="1"
                max="14"
                value={genRows}
                onChange={(e) => setGenRows(Math.max(1, Math.min(14, Number(e.target.value))))}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Seats Per Row</label>
              <input
                type="number"
                min="1"
                max="24"
                value={genCols}
                onChange={(e) => setGenCols(Math.max(1, Math.min(24, Number(e.target.value))))}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">VIP Rows (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. E,F"
                value={genVipRows.join(',')}
                onChange={(e) =>
                  setGenVipRows(
                    e.target.value
                      .toUpperCase()
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Accessible Row</label>
              <input
                type="text"
                maxLength={2}
                placeholder="e.g. A"
                value={genAccessibleRow}
                onChange={(e) => setGenAccessibleRow(e.target.value.toUpperCase().trim())}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowGenerator(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateLayout}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate ({genRows * genCols} Seats)</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen Graphic */}
      <div className="relative pt-4 pb-8 flex flex-col items-center">
        <div className="w-3/4 max-w-xl h-2.5 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
        <div className="w-2/3 max-w-md h-6 bg-gradient-to-b from-red-500/10 to-transparent blur-md -mt-2" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-2">
          Curved Screen • All Eyes This Way
        </span>
      </div>

      {/* Interactive Seat Matrix */}
      {sortedRows.length === 0 ? (
        <div className="py-12 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
          <Armchair className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-300">No seats configured yet</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
            Use the Auto Generator above or generate a standard grid to configure your auditorium.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-max flex flex-col items-center gap-3">
            {sortedRows.map((rowLabel) => {
              const rowSeats = rowMap.get(rowLabel) || [];
              return (
                <div key={rowLabel} className="flex items-center gap-3 group/row">
                  {/* Row Letter & Action Menu */}
                  <div className="w-8 flex items-center justify-center font-bold text-xs text-slate-400 bg-slate-900 border border-slate-800 py-1 rounded-lg">
                    {rowLabel}
                  </div>

                  {/* Seat Chips */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {rowSeats.map((seat) => {
                      const isVip = seat.seat_type === 'premium';
                      const isAccessible = seat.seat_type === 'accessible';

                      let styleClass =
                        'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-500';
                      if (isVip) {
                        styleClass =
                          'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30';
                      } else if (isAccessible) {
                        styleClass =
                          'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30';
                      }

                      return (
                        <div
                          key={seat.seat_number}
                          className="relative group/seat"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleSeatType(seat.row_label, seat.seat_number)
                            }
                            title={`Seat ${seat.seat_number} (${seat.seat_type}) - Click to toggle type`}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[11px] font-semibold transition-all cursor-pointer active:scale-90 shadow-sm ${styleClass}`}
                          >
                            {isVip ? (
                              <Crown className="w-3 h-3 text-amber-400" />
                            ) : isAccessible ? (
                              <Accessibility className="w-3.5 h-3.5 text-blue-400" />
                            ) : (
                              <span>{seat.seat_number.replace(seat.row_label, '')}</span>
                            )}
                          </button>

                          {/* Quick delete single seat */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSeat(seat.row_label, seat.seat_number);
                            }}
                            className="hidden group-hover/seat:flex absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 hover:bg-red-700 text-white rounded-full items-center justify-center text-[9px] shadow-md cursor-pointer"
                            title="Remove seat"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Row management buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity pl-2">
                    <button
                      type="button"
                      onClick={() => handleAddSeatToRow(rowLabel)}
                      title="Add seat to row"
                      className="p-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-md text-[10px]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetRowType(rowLabel, 'premium')}
                      title="Make whole row VIP"
                      className="p-1 text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md text-[10px]"
                    >
                      <Crown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(rowLabel)}
                      title="Delete entire row"
                      className="p-1 text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 rounded-md text-[10px]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Click any seat to toggle its category: Regular ➔ VIP ➔ Accessible.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
