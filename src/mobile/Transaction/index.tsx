import React, { useState } from 'react';

import { Search, Calendar, ChevronDown } from 'lucide-react';

import BottomNavigation from '@ui/BottomNavigation';
import TransactionCard from '@components/Transaction/TransactionCard';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  date: Date;
}

const TransactionScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'expense',
      title: 'Perlengkapan Kantor',
      amount: 250000,
      category: 'Operational',
      date: new Date(),
    },
    {
      id: '2',
      type: 'income',
      title: 'Pendapatan Penjualan',
      amount: 1500000,
      category: 'Product Sales',
      date: new Date(),
    },
    {
      id: '3',
      type: 'expense',
      title: 'Biaya Pemasaran',
      amount: 75000,
      category: 'Marketing',
      date: new Date(),
    },
    {
      id: '4',
      type: 'income',
      title: 'Biaya Layanan',
      amount: 200000,
      category: 'Service Fee',
      date: new Date(),
    },
    {
      id: '5',
      type: 'expense',
      title: 'Transportasi',
      amount: 50000,
      category: 'Transportation',
      date: new Date(),
    },
    {
      id: '6',
      type: 'income',
      title: 'Pemasukan Konsultasi',
      amount: 300000,
      category: 'Consulting',
      date: new Date(),
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <div className="flex-1 pb-[74px]"> {/* Add padding bottom to account for navigation */}
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
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-3 px-4 py-3 overflow-x-auto">
          <button className="flex items-center gap-2 px-4 h-8 bg-[#EBF2E8] rounded-2xl">
            <span className="text-sm font-medium text-[#0D141C] whitespace-nowrap">Tanggal</span>
            <Calendar className="w-5 h-5 text-[#0D141C]" />
          </button>
          <button className="flex items-center gap-2 px-4 h-8 bg-[#EBF2E8] rounded-2xl">
            <span className="text-sm font-medium text-[#0D141C] whitespace-nowrap">Kategori</span>
            <ChevronDown className="w-5 h-5 text-[#0D141C]" />
          </button>
          <button className="flex items-center gap-2 px-4 h-8 bg-[#EBF2E8] rounded-2xl">
            <span className="text-sm font-medium text-[#0D141C] whitespace-nowrap">Jumlah</span>
            <ChevronDown className="w-5 h-5 text-[#0D141C]" />
          </button>
        </div>

        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              title={transaction.title}
              amount={formatCurrency(transaction.amount)}
              type={transaction.type}
              category={transaction.category}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default TransactionScreen; 