import React, { useState, useMemo } from 'react';
import { useSnacks } from '../hooks/useSnacks';
import { useSnackOrders } from '../hooks/useSnackOrders';
import {
  useCreateSnack,
  useUpdateSnack,
  useToggleSnackAvailability,
  useDeleteSnack,
  useCreateSnackOrder,
  useUpdateSnackOrderStatus,
} from '../hooks/useSnackMutations';
import { useCinemas } from '../../cinemas/hooks/useCinemas';
import { useProfiles } from '../../bookings/hooks/useProfiles';
import { SnackHeader } from '../components/SnackHeader';
import { SnackList } from '../components/SnackList';
import { SnackFormModal } from '../components/SnackFormModal';
import { DeleteSnackDialog } from '../components/DeleteSnackDialog';
import { SnackOrderList } from '../components/SnackOrderList';
import { PosSnackOrderModal } from '../components/PosSnackOrderModal';
import { SnackOrderDetailModal } from '../components/SnackOrderDetailModal';
import type {
  Snack,
  SnackInsert,
  SnackOrder,
  SnackOrderStatus,
  CreateSnackOrderPayload,
} from '../../../types';

export const SnacksPage: React.FC = () => {
  const { data: snacks = [], isLoading: isLoadingSnacks } = useSnacks();
  const { data: orders = [], isLoading: isLoadingOrders } = useSnackOrders();
  const { data: cinemas = [], isLoading: isLoadingCinemas } = useCinemas();
  const { data: profiles = [], isLoading: isLoadingProfiles } = useProfiles();

  // Mutations
  const createSnackMutation = useCreateSnack();
  const updateSnackMutation = useUpdateSnack();
  const toggleAvailabilityMutation = useToggleSnackAvailability();
  const deleteSnackMutation = useDeleteSnack();
  const createOrderMutation = useCreateSnackOrder();
  const updateOrderStatusMutation = useUpdateSnackOrderStatus();

  // Navigation & Filter states
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cinemaFilter, setCinemaFilter] = useState('all');

  // Modal states
  const [isSnackFormOpen, setIsSnackFormOpen] = useState(false);
  const [editingSnack, setEditingSnack] = useState<Snack | null>(null);
  const [deletingSnack, setDeletingSnack] = useState<Snack | null>(null);
  const [isPosOrderOpen, setIsPosOrderOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<SnackOrder | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    snacks.forEach((s) => set.add(s.category));
    return Array.from(set).sort();
  }, [snacks]);

  // Filtered Snacks
  const filteredSnacks = useMemo(() => {
    return snacks.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === 'all' || s.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [snacks, search, categoryFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.order_code.toLowerCase().includes(search.toLowerCase()) ||
        (o.profile?.full_name &&
          o.profile.full_name.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchCinema =
        cinemaFilter === 'all' || o.cinema_id === cinemaFilter;
      return matchSearch && matchStatus && matchCinema;
    });
  }, [orders, search, statusFilter, cinemaFilter]);

  // Aggregate KPI metrics
  const { totalOrdersRevenue, pendingOrdersCount } = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const pending = orders.filter((o) => o.status === 'pending' || o.status === 'preparing').length;
    return { totalOrdersRevenue: revenue, pendingOrdersCount: pending };
  }, [orders]);

  // Snack item handlers
  const handleSnackFormSubmit = async (formData: SnackInsert) => {
    if (editingSnack) {
      await updateSnackMutation.mutateAsync({
        id: editingSnack.id,
        updates: formData,
      });
    } else {
      await createSnackMutation.mutateAsync(formData);
    }
    setIsSnackFormOpen(false);
    setEditingSnack(null);
  };

  const handleToggleAvailability = async (id: string, is_available: boolean) => {
    await toggleAvailabilityMutation.mutateAsync({ id, is_available });
  };

  const handleDeleteSnackConfirm = async (id: string) => {
    await deleteSnackMutation.mutateAsync(id);
    setDeletingSnack(null);
  };

  // Concession order handlers
  const handleCreateOrder = async (payload: CreateSnackOrderPayload) => {
    const newOrder = await createOrderMutation.mutateAsync(payload);
    if (newOrder) {
      setViewingOrder(newOrder);
    }
  };

  const handleOrderStatusChange = async (id: string, status: SnackOrderStatus) => {
    await updateOrderStatusMutation.mutateAsync({ id, status });
  };

  const isLoading =
    isLoadingSnacks || isLoadingOrders || isLoadingCinemas || isLoadingProfiles;

  return (
    <div className="space-y-6">
      <SnackHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        cinemaFilter={cinemaFilter}
        onCinemaFilterChange={setCinemaFilter}
        cinemas={cinemas}
        totalSnacksCount={snacks.length}
        totalOrdersRevenue={totalOrdersRevenue}
        pendingOrdersCount={pendingOrdersCount}
        onOpenAddSnack={() => {
          setEditingSnack(null);
          setIsSnackFormOpen(true);
        }}
        onOpenNewOrder={() => setIsPosOrderOpen(true)}
      />

      {/* Main Tab Content */}
      {activeTab === 'menu' ? (
        <SnackList
          snacks={filteredSnacks}
          isLoading={isLoading}
          onEdit={(s) => {
            setEditingSnack(s);
            setIsSnackFormOpen(true);
          }}
          onDelete={(s) => setDeletingSnack(s)}
          onToggleAvailability={handleToggleAvailability}
          onAddSnack={() => {
            setEditingSnack(null);
            setIsSnackFormOpen(true);
          }}
        />
      ) : (
        <SnackOrderList
          orders={filteredOrders}
          isLoading={isLoading}
          onViewOrder={(order) => setViewingOrder(order)}
          onStatusChange={handleOrderStatusChange}
          onNewOrder={() => setIsPosOrderOpen(true)}
        />
      )}

      {/* Add / Edit Snack Modal */}
      <SnackFormModal
        isOpen={isSnackFormOpen}
        onClose={() => {
          setIsSnackFormOpen(false);
          setEditingSnack(null);
        }}
        onSubmit={handleSnackFormSubmit}
        initialData={editingSnack}
        isLoading={createSnackMutation.isPending || updateSnackMutation.isPending}
      />

      {/* Delete Snack Dialog */}
      <DeleteSnackDialog
        isOpen={!!deletingSnack}
        snack={deletingSnack}
        onClose={() => setDeletingSnack(null)}
        onConfirm={handleDeleteSnackConfirm}
        isLoading={deleteSnackMutation.isPending}
      />

      {/* POS Concession Order Modal */}
      <PosSnackOrderModal
        isOpen={isPosOrderOpen}
        snacks={snacks}
        cinemas={cinemas}
        profiles={profiles}
        onClose={() => setIsPosOrderOpen(false)}
        onSubmit={handleCreateOrder}
        isLoading={createOrderMutation.isPending}
      />

      {/* Order Receipt Detail Modal */}
      <SnackOrderDetailModal
        isOpen={!!viewingOrder}
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
      />
    </div>
  );
};
