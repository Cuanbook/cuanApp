import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, X } from 'lucide-react';
import BottomNavigation from '@ui/BottomNavigation';
import TransactionCard from '@components/Transaction/TransactionCard';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getApiUrl } from '@/config/api';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  name: string;
  amount: number;
  category: { name: string; type: 'INCOME' | 'EXPENSE' };
  date: string;
}

interface Filter {
  startDate: Date | null;
  endDate: Date | null;
  category: string;
  minAmount: number;
  maxAmount: number;
}

interface TransactionData {
  transactions: Transaction[];
}

interface Category {
  name: string;
  type: "INCOME" | "EXPENSE";
}

const TransactionScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showAmountFilter, setShowAmountFilter] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<Filter>({
    startDate: null,
    endDate: null,
    category: '',
    minAmount: 0,
    maxAmount: Infinity,
  });

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let url = getApiUrl("transactions");
    if (filters.startDate && filters.endDate) {
      url += `?startDate=${filters.startDate.toISOString()}&endDate=${filters.endDate.toISOString()}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json() as TransactionData;
        setTransactions(data.transactions || []);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.transactions.map((t) => t.category))
        );
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters.startDate, filters.endDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAmount = transaction.amount >= filters.minAmount && 
                         transaction.amount <= (filters.maxAmount || Infinity);
    return matchesSearch && matchesAmount;
  });

  const handleDateFilter = (start: Date | null, end: Date | null) => {
    setFilters(prev => ({ ...prev, startDate: start, endDate: end }));
    setShowDatePicker(false);
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
    setShowCategoryFilter(false);
  };

  const handleAmountFilter = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, minAmount: min, maxAmount: max }));
    setShowAmountFilter(false);
  };

  const clearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      category: '',
      minAmount: 0,
      maxAmount: Infinity,
    });
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <div className="flex-1 pb-[74px]">
        {/* Header */}
        <div className="flex items-center w-full relative py-5 px-4">
          <div className="flex-1 text-center">
            <h1 className="font-bold text-[#111611] text-lg font-['Manrope']">
              Transaksi
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="flex items-center bg-[#EBF2E8] rounded-xl h-[48px]">
            <div className="px-4">
              <Search className="w-6 h-6 text-[#639154]" />
            </div>
            <input
              type="text"
              placeholder="Cari Transaksi"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[#639154] placeholder-[#639154] font-inter outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="px-4"
              >
                <X className="w-5 h-5 text-[#639154]" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-3 px-4 py-3 overflow-x-auto">
          <button 
            className={`flex items-center gap-2 px-4 h-8 ${filters.startDate ? 'bg-[#639154] text-white' : 'bg-[#EBF2E8]'} rounded-2xl`}
            onClick={() => setShowDatePicker(true)}
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {filters.startDate ? format(filters.startDate, 'dd MMM', { locale: id }) : 'Tanggal'}
            </span>
            <Calendar className="w-5 h-5" />
          </button>
          <button 
            className={`flex items-center gap-2 px-4 h-8 ${filters.category ? 'bg-[#639154] text-white' : 'bg-[#EBF2E8]'} rounded-2xl`}
            onClick={() => setShowCategoryFilter(true)}
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {filters.category || 'Kategori'}
            </span>
            <ChevronDown className="w-5 h-5" />
          </button>
          <button 
            className={`flex items-center gap-2 px-4 h-8 ${filters.minAmount > 0 || filters.maxAmount < Infinity ? 'bg-[#639154] text-white' : 'bg-[#EBF2E8]'} rounded-2xl`}
            onClick={() => setShowAmountFilter(true)}
          >
            <span className="text-sm font-medium whitespace-nowrap">Jumlah</span>
            <ChevronDown className="w-5 h-5" />
          </button>
          {(filters.startDate || filters.category || filters.minAmount > 0 || filters.maxAmount < Infinity || searchQuery) && (
            <button 
              className="flex items-center gap-2 px-4 h-8 bg-red-100 text-red-600 rounded-2xl"
              onClick={clearFilters}
            >
              <span className="text-sm font-medium whitespace-nowrap">Reset</span>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Modals */}
        {showDatePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
              <h3 className="text-lg font-bold mb-4">Pilih Rentang Tanggal</h3>
              <div className="flex gap-4 mb-4">
                <input 
                  type="date" 
                  className="flex-1 p-2 border rounded"
                  onChange={(e) => handleDateFilter(new Date(e.target.value), filters.endDate)}
                />
                <input 
                  type="date" 
                  className="flex-1 p-2 border rounded"
                  onChange={(e) => handleDateFilter(filters.startDate, new Date(e.target.value))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  className="px-4 py-2 text-gray-600"
                  onClick={() => setShowDatePicker(false)}
                >
                  Batal
                </button>
                <button 
                  className="px-4 py-2 bg-[#639154] text-white rounded"
                  onClick={() => handleDateFilter(null, null)}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {showCategoryFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
              <h3 className="text-lg font-bold mb-4">Pilih Kategori</h3>
              <div className="max-h-[60vh] overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`w-full text-left p-3 rounded ${filters.category === category.name ? 'bg-[#EBF2E8] text-[#639154]' : ''}`}
                    onClick={() => handleCategoryFilter(category.name)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  className="px-4 py-2 text-gray-600"
                  onClick={() => setShowCategoryFilter(false)}
                >
                  Batal
                </button>
                <button 
                  className="px-4 py-2 bg-[#639154] text-white rounded"
                  onClick={() => handleCategoryFilter('')}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {showAmountFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
              <h3 className="text-lg font-bold mb-4">Filter Jumlah</h3>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Minimal</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    placeholder="0"
                    value={filters.minAmount || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, minAmount: Number(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Maksimal</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    placeholder="Tidak ada batas"
                    value={filters.maxAmount === Infinity ? '' : filters.maxAmount}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: Number(e.target.value) || Infinity }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  className="px-4 py-2 text-gray-600"
                  onClick={() => setShowAmountFilter(false)}
                >
                  Batal
                </button>
                <button 
                  className="px-4 py-2 bg-[#639154] text-white rounded"
                  onClick={() => handleAmountFilter(0, Infinity)}
                >
                  Reset
                </button>
                <button 
                  className="px-4 py-2 bg-[#639154] text-white rounded"
                  onClick={() => setShowAmountFilter(false)}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                title={transaction.name}
                amount={formatCurrency(transaction.amount)}
                type={transaction.type === 'INCOME' ? 'income' : 'expense'}
                category={transaction.category?.name || ''}
                date={format(new Date(transaction.date), 'dd MMM yyyy', { locale: id })}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <p>Tidak ada transaksi</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default TransactionScreen;