import React, { useState, useMemo } from 'react';
import { useShowtimes } from '../hooks/useShowtimes';
import {
  useCreateShowtime,
  useUpdateShowtime,
  useUpdateShowtimeStatus,
  useDeleteShowtime,
} from '../hooks/useShowtimeMutations';
import { useMovies } from '../../movies/hooks/useMovies';
import { useCinemas } from '../../cinemas/hooks/useCinemas';
import { ShowtimeHeader } from '../components/ShowtimeHeader';
import { ShowtimeList } from '../components/ShowtimeList';
import { ShowtimeFormModal } from '../components/ShowtimeFormModal';
import { DeleteShowtimeDialog } from '../components/DeleteShowtimeDialog';
import type { Showtime, ShowtimeInsert, ShowtimeStatus } from '../../../types';

export const ShowtimesPage: React.FC = () => {
  const { data: showtimes = [], isLoading: isLoadingShowtimes } = useShowtimes();
  const { data: movies = [], isLoading: isLoadingMovies } = useMovies();
  const { data: cinemas = [], isLoading: isLoadingCinemas } = useCinemas();

  const createMutation = useCreateShowtime();
  const updateMutation = useUpdateShowtime();
  const updateStatusMutation = useUpdateShowtimeStatus();
  const deleteMutation = useDeleteShowtime();

  const [search, setSearch] = useState('');
  const [cinemaFilter, setCinemaFilter] = useState('all');
  const [movieFilter, setMovieFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [deletingShowtime, setDeletingShowtime] = useState<Showtime | null>(null);

  // Filter showtimes
  const filteredShowtimes = useMemo(() => {
    return showtimes.filter((st) => {
      const matchSearch =
        (st.movie?.title && st.movie.title.toLowerCase().includes(search.toLowerCase())) ||
        (st.cinema?.name && st.cinema.name.toLowerCase().includes(search.toLowerCase())) ||
        (st.cinema?.city && st.cinema.city.toLowerCase().includes(search.toLowerCase()));

      const matchCinema = cinemaFilter === 'all' || st.cinema_id === cinemaFilter;
      const matchMovie = movieFilter === 'all' || st.movie_id === movieFilter;
      const matchStatus = statusFilter === 'all' || st.status === statusFilter;

      return matchSearch && matchCinema && matchMovie && matchStatus;
    });
  }, [showtimes, search, cinemaFilter, movieFilter, statusFilter]);

  const handleFormSubmit = async (formData: ShowtimeInsert) => {
    if (editingShowtime) {
      await updateMutation.mutateAsync({
        id: editingShowtime.id,
        updates: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsFormOpen(false);
    setEditingShowtime(null);
  };

  const handleStatusChange = async (id: string, status: ShowtimeStatus) => {
    await updateStatusMutation.mutateAsync({ id, status });
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeletingShowtime(null);
  };

  const isLoading = isLoadingShowtimes || isLoadingMovies || isLoadingCinemas;

  return (
    <div className="space-y-6">
      <ShowtimeHeader
        search={search}
        onSearchChange={setSearch}
        cinemaFilter={cinemaFilter}
        onCinemaFilterChange={setCinemaFilter}
        movieFilter={movieFilter}
        onMovieFilterChange={setMovieFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        cinemas={cinemas}
        movies={movies}
        totalCount={filteredShowtimes.length}
        onOpenScheduleModal={() => {
          setEditingShowtime(null);
          setIsFormOpen(true);
        }}
      />

      <ShowtimeList
        showtimes={filteredShowtimes}
        isLoading={isLoading}
        onEdit={(st) => {
          setEditingShowtime(st);
          setIsFormOpen(true);
        }}
        onDelete={(st) => setDeletingShowtime(st)}
        onStatusChange={handleStatusChange}
        onAddShowtime={() => {
          setEditingShowtime(null);
          setIsFormOpen(true);
        }}
      />

      {/* Schedule / Edit Modal */}
      <ShowtimeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingShowtime(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingShowtime}
        movies={movies}
        cinemas={cinemas}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteShowtimeDialog
        isOpen={!!deletingShowtime}
        showtime={deletingShowtime}
        onClose={() => setDeletingShowtime(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
