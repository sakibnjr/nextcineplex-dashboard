import React from 'react';
import {
  Popcorn,
  ShoppingBag,
  Plus,
  Search,
  Building2,
  Filter,
} from 'lucide-react';
import type { Cinema } from '../../../types';

interface Props {
  activeTab: 'menu' | 'orders';
  onTabChange: (tab: 'menu' | 'orders') => void;
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  categories: string[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  cinemaFilter: string;
  onCinemaFilterChange: (id: string) => void;
  cinemas: Cinema[];
  totalSnacksCount: number;
  totalOrdersRevenue: number;
  pendingOrdersCount: number;
  onOpenAddSnack: () => void;
  onOpenNewOrder: () => void;
}

export const SnackHeader: React.FC<Props> = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  statusFilter,
  onStatusFilterChange,
  cinemaFilter,
  onCinemaFilterChange,
  cinemas,
  totalSnacksCount,
  totalOrdersRevenue,
  pendingOrdersCount,
  onOpenAddSnack,
  onOpenNewOrder,
}) => {
  return (
    <div className="flex flex-col gap-5 pb-6 border-b border-slate-800/80">
      {/* Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Popcorn className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Snacks Bar & Concessions
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700/50">
                {totalSnacksCount} Items
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                ৳{totalOrdersRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Revenue
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage popcorn, beverages, and combos menu catalog or process live concession sales.
            </p>
          </div>
        </div>

        {activeTab === 'menu' ? (
          <button
            type="button"
            onClick={onOpenAddSnack}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenNewOrder}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Concession Order</span>
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => onTabChange('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Popcorn className="w-4 h-4" />
            <span>Menu Catalog ({totalSnacksCount})</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Live Orders & Kitchen</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'menu'
                ? 'Search snack name, category...'
                : 'Search order code (SNK-), customer...'
            }
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Dynamic Filter depending on tab */}
        {activeTab === 'menu' ? (
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              aria-label="Filter by Category"
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl pl-8 pr-8 py-2 outline-none focus:border-red-500 transition-all cursor-pointer appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ) : (
          <>
            {/* Cinema Filter */}
            <div className="relative">
              <select
                value={cinemaFilter}
                onChange={(e) => onCinemaFilterChange(e.target.value)}
                aria-label="Filter by Cinema Counter"
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl pl-8 pr-8 py-2 outline-none focus:border-red-500 transition-all cursor-pointer appearance-none"
              >
                <option value="all">All Counters</option>
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
              <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              aria-label="Filter by Order Status"
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-red-500 transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </>
        )}
      </div>
    </div>
  );
};
