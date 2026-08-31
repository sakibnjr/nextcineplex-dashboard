import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Building2,
  User,
  Popcorn,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type {
  Snack,
  Cinema,
  Profile,
  CreateSnackOrderPayload,
} from '../../../types';

interface Props {
  isOpen: boolean;
  snacks: Snack[];
  cinemas: Cinema[];
  profiles: Profile[];
  onClose: () => void;
  onSubmit: (payload: CreateSnackOrderPayload) => Promise<void>;
  isLoading: boolean;
}

export const PosSnackOrderModal: React.FC<Props> = ({
  isOpen,
  snacks,
  cinemas,
  profiles,
  onClose,
  onSubmit,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <PosSnackOrderModalContent
      snacks={snacks}
      cinemas={cinemas}
      profiles={profiles}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};

interface ContentProps {
  snacks: Snack[];
  cinemas: Cinema[];
  profiles: Profile[];
  onClose: () => void;
  onSubmit: (payload: CreateSnackOrderPayload) => Promise<void>;
  isLoading: boolean;
}

const PosSnackOrderModalContent: React.FC<ContentProps> = ({
  snacks,
  cinemas,
  profiles,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>(
    cinemas[0]?.id || ''
  );
  const [selectedUserId, setSelectedUserId] = useState<string>(
    profiles[0]?.id || ''
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    snacks.forEach((s) => set.add(s.category));
    return Array.from(set).sort();
  }, [snacks]);

  // Filtered available snacks
  const availableSnacks = useMemo(() => {
    return snacks
      .filter((s) => s.is_available)
      .filter((s) => categoryFilter === 'all' || s.category === categoryFilter);
  }, [snacks, categoryFilter]);

  // Adjust cart quantity
  const handleSetQuantity = (snackId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[snackId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[snackId];
        return copy;
      }
      return { ...prev, [snackId]: next };
    });
  };

  // Cart itemized calculation
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([snackId, quantity]) => {
        const snack = snacks.find((s) => s.id === snackId);
        if (!snack || quantity <= 0) return null;
        return {
          snack,
          quantity,
          subtotal: quantity * Number(snack.price),
        };
      })
      .filter((item): item is { snack: Snack; quantity: number; subtotal: number } => item !== null);
  }, [cart, snacks]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCinemaId) {
      setErrorMsg('Please select a cinema counter.');
      return;
    }
    if (cartItems.length === 0) {
      setErrorMsg('Please add at least one concession item to the cart.');
      return;
    }

    setErrorMsg(null);
    try {
      const payload: CreateSnackOrderPayload = {
        user_id: selectedUserId || profiles[0]?.id || '',
        cinema_id: selectedCinemaId,
        items: cartItems.map((item) => ({
          snack_id: item.snack.id,
          quantity: item.quantity,
          unit_price: Number(item.snack.price),
        })),
        total_amount: totalAmount,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to place concession order');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                POS Concession Counter Order
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Add snacks & beverages to customer order and process instant payment.
              </p>
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

        {/* Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-y-auto">
          {/* Left 2 Cols: Item Picker & Category Filter */}
          <div className="lg:col-span-2 p-5 border-b lg:border-b-0 lg:border-r border-slate-800/80 space-y-4 overflow-y-auto">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Menu
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            {availableSnacks.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">
                No items available in this category.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSnacks.map((snack) => {
                  const qty = cart[snack.id] || 0;
                  return (
                    <div
                      key={snack.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="h-20 w-full rounded-xl overflow-hidden bg-slate-950 relative">
                          {snack.image_url ? (
                            <img
                              src={snack.image_url}
                              alt={snack.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                              <Popcorn className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {snack.name}
                        </h4>
                        <span className="text-xs font-black text-amber-400 block">
                          ৳{Number(snack.price).toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800">
                        {qty > 0 ? (
                          <div className="flex items-center justify-between w-full">
                            <button
                              type="button"
                              onClick={() => handleSetQuantity(snack.id, -1)}
                              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-white text-xs font-mono">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSetQuantity(snack.id, 1)}
                              className="w-7 h-7 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetQuantity(snack.id, 1)}
                            className="w-full py-1.5 bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/30 border border-slate-700/60 rounded-xl text-[11px] font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Col: Customer Details & Order Cart */}
          <div className="p-5 flex flex-col justify-between space-y-4 bg-slate-950/60">
            <div className="space-y-4">
              {/* Cinema Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Cinema Counter <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCinemaId}
                    onChange={(e) => setSelectedCinemaId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {cinemas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                  </select>
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Customer Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Customer / Guest <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name || 'Customer'} ({p.phone || 'No Phone'})
                      </option>
                    ))}
                  </select>
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Order Items ({totalQuantity})
                </label>

                {cartItems.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                    No items selected yet. Click + Add on any food item to start.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                    {cartItems.map(({ snack, quantity, subtotal }) => (
                      <div
                        key={snack.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-[10px]">
                            {quantity}x
                          </span>
                          <span className="font-semibold text-white truncate max-w-[130px]">
                            {snack.name}
                          </span>
                        </div>
                        <span className="font-bold text-emerald-400">
                          ৳{subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Total & Checkout */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Items Count:</span>
                <span className="text-white font-semibold">{totalQuantity}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-300">Total Charge:</span>
                <span className="text-xl font-black text-emerald-400">
                  ৳{totalAmount.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                disabled={isLoading || cartItems.length === 0}
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Place Order (৳{totalAmount.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
