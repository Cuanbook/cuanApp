import React, { useState } from 'react';

import { ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';

import BottomNavigation from '@ui/BottomNavigation';
import { ChartLineSimple } from '@components/Report/ChartLineSimple';

type TabType = 'ringkasan' | 'pemasukan' | 'pengeluaran';

// Chart data for each tab
const chartData = {
  ringkasan: [
    { month: "2024-01", value: 2100000 },
    { month: "2024-02", value: 1890000 },
    { month: "2024-03", value: 2250000 },
    { month: "2024-04", value: 1950000 },
    { month: "2024-05", value: 2450000 },
    { month: "2024-06", value: 2680000 }
  ],
  pemasukan: [
    { month: "2024-01", value: 1200000 },
    { month: "2024-02", value: 1500000 },
    { month: "2024-03", value: 1800000 },
    { month: "2024-04", value: 1600000 },
    { month: "2024-05", value: 2100000 },
    { month: "2024-06", value: 2300000 }
  ],
  pengeluaran: [
    { month: "2024-01", value: 900000 },
    { month: "2024-02", value: 750000 },
    { month: "2024-03", value: 1100000 },
    { month: "2024-04", value: 850000 },
    { month: "2024-05", value: 950000 },
    { month: "2024-06", value: 1200000 }
  ]
};

interface TransactionItemProps {
  title: string;
  type: string;
  amount: string;
  icon: React.ReactNode;
  description?: string;
  isExpense?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ title, type, amount, icon, description, isExpense }) => {
  return (
    <div className="flex justify-between items-center py-2 px-4">
      <div className="flex items-center gap-4">
        <div className={`w-6 h-6 ${isExpense ? 'text-[#FF0505]' : 'text-[#088738]'}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-inter text-base font-medium text-[#111611]">{title}</span>
          {description ? (
            <span className="font-inter text-sm text-[#639154]">{description}</span>
          ) : (
            <span className="font-inter text-sm text-[#639154]">{type}</span>
          )}
        </div>
      </div>
      <span className={`font-inter text-base ${isExpense ? 'text-[#FF0505]' : 'text-[#088738]'}`}>
        {amount}
      </span>
    </div>
  );
};

const Report: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ringkasan');
  const [prevTab, setPrevTab] = useState<TabType>('ringkasan');

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      setPrevTab(activeTab);
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pemasukan':
        return (
          <>
            <div className="px-4 pt-5 pb-3">
              <h2 className="font-inter font-bold text-[22px] text-[#111611]">Pemasukan</h2>
            </div>

            <div className="px-4 py-6">
              <ChartLineSimple 
                title="Tren Pemasukan"
                amount="12.345.000"
                trend={{ percentage: 12, isUp: true }}
                data={chartData.pemasukan}
                shouldAnimate={activeTab !== prevTab}
              />
            </div>

            <div className="px-4 pt-5 pb-3">
              <h2 className="font-inter font-bold text-[22px] text-[#111611]">Transaksi</h2>
            </div>

            <div className="flex gap-3 px-3">
              <button className="h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center">
                <span className="font-inter text-sm font-medium text-[#111611]">Semua</span>
              </button>
              <button className="h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center">
                <span className="font-inter text-sm font-medium text-[#111611]">Penjualan</span>
              </button>
              <button className="h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center">
                <span className="font-inter text-sm font-medium text-[#111611]">Jasa</span>
              </button>
            </div>

            <div className="flex flex-col mt-2">
              <TransactionItem
                title="Penjualan Produk"
                type="Penjualan"
                amount="+ Rp 1.200.000"
                icon={<ArrowUpRight className="stroke-[2]" />}
              />
              <TransactionItem
                title="Biaya Konsultasi"
                type="Jasa"
                amount="+ Rp 800.000"
                icon={<ArrowUpRight className="stroke-[2]" />}
              />
              <TransactionItem
                title="Penjualan Produk"
                type="Penjualan"
                amount="+ Rp 1.500.000"
                icon={<ArrowUpRight className="stroke-[2]" />}
              />
            </div>
          </>
        );
      case 'pengeluaran':
        return (
          <>
            <div className="px-4 pt-5 pb-3">
              <h2 className="font-inter font-bold text-[22px] text-[#111611]">Pengeluaran</h2>
            </div>

            <div className="px-4 py-6">
              <ChartLineSimple 
                title="Tren Pengeluaran"
                amount="12.345.000"
                trend={{ percentage: 8, isUp: false }}
                data={chartData.pengeluaran}
                shouldAnimate={activeTab !== prevTab}
              />
            </div>

            <div className="px-4 pt-5 pb-3">
              <h2 className="font-inter font-bold text-[22px] text-[#111611]">Transaksi</h2>
            </div>

            <div className="flex gap-3 px-3">
              <button className="h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center">
                <span className="font-inter text-sm font-medium text-[#111611]">Semua</span>
              </button>
              <button className="h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center">
                <span className="font-inter text-sm font-medium text-[#111611]">Perlengkapan</span>
              </button>
              <button className="h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center">
                <span className="font-inter text-sm font-medium text-[#111611]">Sewa</span>
              </button>
            </div>

            <div className="flex flex-col mt-2">
              <TransactionItem
                title="Beli Perlengkapan"
                type="Perlengkapan"
                description="Perlengkapan Kantor"
                amount="- Rp 150.000"
                icon={<ArrowDownLeft className="stroke-[2]" />}
                isExpense
              />
              <TransactionItem
                title="Transportasi"
                type="Transportasi"
                description="Pembelian Bahan Bakar"
                amount="- Rp 300.000"
                icon={<ArrowDownLeft className="stroke-[2]" />}
                isExpense
              />
              <TransactionItem
                title="Gaji Karyawan"
                type="Gaji"
                description="Pembayaran Gaji Bulanan"
                amount="- Rp 1.300.000"
                icon={<ArrowDownLeft className="stroke-[2]" />}
                isExpense
              />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="px-4 pt-5 pb-3">
              <h2 className="font-inter font-bold text-[22px] text-[#111611]">Pemasukan vs. Pengeluaran</h2>
            </div>

            <div className="px-4 py-6">
              <ChartLineSimple 
                title="Pemasukan vs. Pengeluaran"
                amount="12.345.000"
                trend={{ percentage: 12, isUp: true }}
                data={chartData.ringkasan}
                shouldAnimate={activeTab !== prevTab}
              />
            </div>

            <div className="px-4 pt-5 pb-3">
              <h2 className="font-inter font-bold text-[22px] text-[#111611]">Transaksi</h2>
            </div>

            <div className="flex gap-3 px-3">
              <button className="h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center">
                <span className="font-inter text-sm font-medium text-[#111611]">Semua</span>
              </button>
              <button className="h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center">
                <span className="font-inter text-sm font-medium text-[#111611]">Pemasukan</span>
              </button>
              <button className="h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center">
                <span className="font-inter text-sm font-medium text-[#111611]">Pengeluaran</span>
              </button>
            </div>

            <div className="flex flex-col mt-2">
              <TransactionItem
                title="Transaksi 1"
                type="Penjualan"
                amount="+ Rp 1.000.000"
                icon={<ArrowUpRight className="stroke-[2]" />}
              />
              <TransactionItem
                title="Transaksi 2"
                type="Pembelian"
                amount="- Rp 500.000"
                icon={<ArrowDownLeft className="stroke-[2]" />}
                isExpense
              />
              <TransactionItem
                title="Transaksi 3"
                type="Penjualan"
                amount="+ Rp 2.000.000"
                icon={<ArrowUpRight className="stroke-[2]" />}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-[84px]">
      {/* Header */}
      <div className="flex items-center justify-center p-4">
        <h1 className="font-inter font-bold text-[18px] text-[#111611]">Laporan</h1>
      </div>

      {/* Summary Tabs */}
      <div className="flex justify-stretch items-stretch mx-4 h-[40px] bg-[#EBF2E8] rounded-[20px] p-1">
        <div className="flex-1" onClick={() => handleTabChange('ringkasan')}>
          <div className={`h-full flex items-center justify-center transition-all duration-300 ${activeTab === 'ringkasan' ? 'bg-white rounded-[16px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]' : ''}`}>
            <span className={`font-inter text-sm font-medium transition-colors duration-300 ${activeTab === 'ringkasan' ? 'text-[#111611]' : 'text-[#639154]'}`}>
              Ringkasan
            </span>
          </div>
        </div>
        <div className="flex-1" onClick={() => handleTabChange('pemasukan')}>
          <div className={`h-full flex items-center justify-center transition-all duration-300 ${activeTab === 'pemasukan' ? 'bg-white rounded-[16px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]' : ''}`}>
            <span className={`font-inter text-sm font-medium transition-colors duration-300 ${activeTab === 'pemasukan' ? 'text-[#111611]' : 'text-[#639154]'}`}>
              Pemasukan
            </span>
          </div>
        </div>
        <div className="flex-1" onClick={() => handleTabChange('pengeluaran')}>
          <div className={`h-full flex items-center justify-center transition-all duration-300 ${activeTab === 'pengeluaran' ? 'bg-white rounded-[16px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]' : ''}`}>
            <span className={`font-inter text-sm font-medium transition-colors duration-300 ${activeTab === 'pengeluaran' ? 'text-[#111611]' : 'text-[#639154]'}`}>
              Pengeluaran
            </span>
          </div>
        </div>
      </div>

      {renderContent()}

      {/* Export Button */}
      <div className="flex justify-end px-5 py-5">
        <button className="flex items-center gap-4 bg-[#54D12B] rounded-[28px] py-4 px-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <FileText className="w-6 h-6 text-[#0F1417]" />
          <span className="font-inter text-base font-bold text-[#0F1417]">Ekspor PDF</span>
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Report; 