import React from 'react';
import { X, Armchair, Loader2 } from 'lucide-react';
import { useCinemaSeats } from '../hooks/useCinemaSeats';
import { useSaveCinemaSeats } from '../hooks/useCinemaMutations';
import { SeatMapEditor } from './SeatMapEditor';
import type { CinemaWithStats, SeatInsert } from '../../../types';

interface Props {
  isOpen: boolean;
  cinema: CinemaWithStats | null;
  onClose: () => void;
}

export const SeatMapModal: React.FC<Props> = ({ isOpen, cinema, onClose }) => {
  if (!isOpen || !cinema) return null;

  return (
    <SeatMapModalContent
      key={cinema.id}
      cinema={cinema}
      onClose={onClose}
    />
  );
};

interface ContentProps {
  cinema: CinemaWithStats;
  onClose: () => void;
}

const SeatMapModalContent: React.FC<ContentProps> = ({ cinema, onClose }) => {
  const { data: seats = [], isLoading: isFetchingSeats } = useCinemaSeats(cinema.id);
  const saveSeatsMutation = useSaveCinemaSeats();

  const handleSaveSeats = async (newSeats: SeatInsert[]) => {
    await saveSeatsMutation.mutateAsync({
      cinemaId: cinema.id,
      seats: newSeats,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:px-6 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
              <Armchair className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Auditorium Seat Map & Layout
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {cinema.city}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{cinema.name}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {isFetchingSeats ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              <p className="text-xs text-slate-400">Loading seat layout configuration...</p>
            </div>
          ) : (
            <SeatMapEditor
              cinemaId={cinema.id}
              initialSeats={seats.map((s) => ({
                row_label: s.row_label,
                seat_number: s.seat_number,
                seat_type: s.seat_type,
              }))}
              onSave={handleSaveSeats}
              isLoading={saveSeatsMutation.isPending}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
