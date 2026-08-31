import React, { useState, useMemo } from 'react';
import { useCinemas } from '../hooks/useCinemas';
import {
  useCreateCinema,
  useUpdateCinema,
  useDeleteCinema,
} from '../hooks/useCinemaMutations';
import { CinemaHeader } from '../components/CinemaHeader';
import { CinemaList } from '../components/CinemaList';
import { CinemaFormModal } from '../components/CinemaFormModal';
import { DeleteCinemaDialog } from '../components/DeleteCinemaDialog';
import { SeatMapModal } from '../components/SeatMapModal';
import type { CinemaWithStats, CinemaInsert } from '../../../types';

export const CinemasPage: React.FC = () => {
  const { data: cinemas = [], isLoading } = useCinemas();
  const createMutation = useCreateCinema();
  const updateMutation = useUpdateCinema();
  const deleteMutation = useDeleteCinema();

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<CinemaWithStats | null>(null);
  const [deletingCinema, setDeletingCinema] = useState<CinemaWithStats | null>(null);
  const [managingSeatsCinema, setManagingSeatsCinema] = useState<CinemaWithStats | null>(null);

  // Extract unique cities for filter dropdown
  const cities = useMemo(() => {
    const set = new Set<string>();
    cinemas.forEach((c) => {
      if (c.city) set.add(c.city);
    });
    return Array.from(set).sort();
  }, [cinemas]);

  // Filter cinemas based on search & city
  const filteredCinemas = useMemo(() => {
    return cinemas.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase());
      const matchCity = cityFilter === 'all' || c.city === cityFilter;
      return matchSearch && matchCity;
    });
  }, [cinemas, search, cityFilter]);

  // Aggregate stats
  const totalSeats = useMemo(() => {
    return cinemas.reduce((sum, c) => sum + (c.seats_count || 0), 0);
  }, [cinemas]);

  const handleFormSubmit = async (formData: CinemaInsert) => {
    if (editingCinema) {
      await updateMutation.mutateAsync({
        id: editingCinema.id,
        updates: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsFormOpen(false);
    setEditingCinema(null);
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeletingCinema(null);
  };

  return (
    <div className="space-y-6">
      <CinemaHeader
        search={search}
        onSearchChange={setSearch}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        cities={cities}
        totalBranches={cinemas.length}
        totalSeats={totalSeats}
        onOpenAddModal={() => {
          setEditingCinema(null);
          setIsFormOpen(true);
        }}
      />

      <CinemaList
        cinemas={filteredCinemas}
        isLoading={isLoading}
        onEdit={(cinema) => {
          setEditingCinema(cinema);
          setIsFormOpen(true);
        }}
        onDelete={(cinema) => setDeletingCinema(cinema)}
        onManageSeats={(cinema) => setManagingSeatsCinema(cinema)}
        onAddCinema={() => {
          setEditingCinema(null);
          setIsFormOpen(true);
        }}
      />

      {/* Add / Edit Cinema Modal */}
      <CinemaFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCinema(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCinema}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCinemaDialog
        isOpen={!!deletingCinema}
        cinema={deletingCinema}
        onClose={() => setDeletingCinema(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />

      {/* Interactive Seat Map Modal */}
      <SeatMapModal
        isOpen={!!managingSeatsCinema}
        cinema={managingSeatsCinema}
        onClose={() => setManagingSeatsCinema(null)}
      />
    </div>
  );
};
