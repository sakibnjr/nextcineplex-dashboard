import React, { useState, useMemo } from 'react';
import { useMovies } from '../hooks/useMovies';
import {
  useCreateMovie,
  useUpdateMovie,
  useDeleteMovie,
} from '../hooks/useMovieMutations';
import { MovieHeader } from '../components/MovieHeader';
import { MovieList } from '../components/MovieList';
import { MovieFormModal } from '../components/MovieFormModal';
import { DeleteMovieDialog } from '../components/DeleteMovieDialog';
import type { Movie, MovieInsert } from '../../../types';

export const MoviesPage: React.FC = () => {
  const { data: movies = [], isLoading } = useMovies();
  const createMutation = useCreateMovie();
  const updateMutation = useUpdateMovie();
  const deleteMutation = useDeleteMovie();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        (m.genre && m.genre.toLowerCase().includes(search.toLowerCase()));
      const matchStatus =
        statusFilter === 'all' || m.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [movies, search, statusFilter]);

  const handleFormSubmit = async (formData: MovieInsert) => {
    if (editingMovie) {
      await updateMutation.mutateAsync({ id: editingMovie.id, updates: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsFormOpen(false);
    setEditingMovie(null);
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeletingMovie(null);
  };

  return (
    <div className="space-y-6">
      <MovieHeader
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenAddModal={() => {
          setEditingMovie(null);
          setIsFormOpen(true);
        }}
        totalCount={filteredMovies.length}
      />

      <MovieList
        movies={filteredMovies}
        isLoading={isLoading}
        onEdit={(m) => {
          setEditingMovie(m);
          setIsFormOpen(true);
        }}
        onDelete={(m) => setDeletingMovie(m)}
      />

      <MovieFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMovie(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingMovie}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteMovieDialog
        isOpen={!!deletingMovie}
        movie={deletingMovie}
        onClose={() => setDeletingMovie(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
