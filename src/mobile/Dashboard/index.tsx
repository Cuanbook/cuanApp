import React, { useState } from "react";

import { ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";

import { TransactionFormData } from "@components/Dashboard/TransactionForm";
import TransactionModal from "@components/Dashboard/TransactionModal";
import BottomNavigation from "@ui/BottomNavigation";

type TimePeriod = 'daily' | 'weekly' | 'monthly';

interface FinancialData {
  income: number;
  expense: number;
  balance: number;
  percentageChange: number;
}

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('monthly');

  // Sample financial data for different periods
  const financialData: Record<TimePeriod, FinancialData> = {
    daily: {
      income: 2000000,
      expense: 1000000,
      balance: 1000000,
      percentageChange: 5,
    },
    weekly: {
      income: 8000000,
      expense: 4000000,
      balance: 4000000,
      percentageChange: 10,
    },
    monthly: {
      income: 15000000,
      expense: 7500000,
      balance: 7500000,
      percentageChange: 15,
    },
  };

  const currentData = financialData[selectedPeriod];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveTransaction = (data: TransactionFormData) => {
    // TODO: Implement saving transaction to backend
    console.log("Saving transaction:", data);
    setIsModalOpen(false);
  };

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'daily':
        return 'Hari Ini';
      case 'weekly':
        return 'Minggu Ini';
      case 'monthly':
        return 'Bulan Ini';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#FAFAFA] pb-[84px]">
        <div className="flex flex-col">
          <header className="flex items-center justify-center gap-4 py-5">
            <img
              src="/logoxuan-removebg-preview--1-.png"
              alt="CuanBook"
              className="w-[22px] h-[25px]"
            />
            <h1 className="font-manrope font-bold text-[18px] text-[#121712]">
              CuanBook
            </h1>
          </header>

          {/* Financial Summary Cards */}
          <div className="flex flex-wrap justify-stretch gap-4 p-4">
            <FinancialCard 
              title="Pemasukan" 
              amount={formatCurrency(currentData.income)} 
            />
            <FinancialCard 
              title="Pengeluaran" 
              amount={formatCurrency(currentData.expense)} 
            />
            <FinancialCard 
              title="Saldo" 
              amount={formatCurrency(currentData.balance)} 
            />
          </div>

          {/* Time Period Tabs */}
          <div className="px-4">
            <div className="bg-[#EBF2E8] rounded-lg p-1 flex gap-2">
              <TimeTab 
                label="Harian" 
                active={selectedPeriod === 'daily'} 
                onClick={() => setSelectedPeriod('daily')}
              />
              <TimeTab 
                label="Mingguan" 
                active={selectedPeriod === 'weekly'} 
                onClick={() => setSelectedPeriod('weekly')}
              />
              <TimeTab 
                label="Bulanan" 
                active={selectedPeriod === 'monthly'} 
                onClick={() => setSelectedPeriod('monthly')}
              />
            </div>
          </div>

          {/* Financial Overview */}
          <div className="p-4 pb-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-manrope font-medium text-base text-[#121A0F]">
                Ringkasan Keuangan
              </h2>
              <div className="flex flex-col">
                <span className="font-manrope font-bold text-[32px] text-[#121A0F]">
                  Rp {formatCurrency(currentData.balance)}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[#639154]">{getPeriodLabel(selectedPeriod)}</span>
                  <span className="text-[#088721] font-medium">
                    +{currentData.percentageChange}%
                  </span>
                </div>
              </div>

              {/* Monthly Chart */}
              <div className="flex gap-6 px-3 mt-4">
                {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"].map((month) => (
                  <div key={month} className="flex flex-col items-end gap-6">
                    <div className="w-full h-[137px] bg-[#EBF2E8] border-t-2 border-[#757575]" />
                    <span className="font-manrope font-bold text-[13px] text-[#639154]">
                      {month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="px-4 py-5 pb-3">
            <h2 className="font-manrope font-bold text-[22px] text-[#121A0F]">
              Transaksi Terbaru
            </h2>
          </div>

          {/* Transaction List */}
          <div className="flex flex-col">
            <TransactionItem
              icon={<ArrowUpRight className="stroke-[2.5]" />}
              amount="5.000.000"
              description="Penjualan Produk A"
              date="Hari ini"
              type="income"
            />
            <TransactionItem
              icon={<ArrowDownLeft className="stroke-[2.5]" />}
              amount="2.500.000"
              description="Pembelian Bahan Baku"
              date="Hari ini"
              type="expense"
            />
            <TransactionItem
              icon={<ArrowUpRight className="stroke-[2.5]" />}
              amount="10.000.000"
              description="Penjualan Produk B"
              date="Kemarin"
              type="income"
            />
          </div>

          {/* Add Transaction Button */}
          <div className="flex justify-end px-5 pb-5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#54D12B] rounded-lg h-14 px-6 shadow-lg"
            >
              <Plus className="w-6 h-6 text-[#121A0F] stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </>
  );
};

interface FinancialCardProps {
  title: string;
  amount: string;
}

const FinancialCard: React.FC<FinancialCardProps> = ({ title, amount }) => {
  return (
    <div className="flex-1 bg-[#EBF2E8] rounded-lg p-6 flex flex-col gap-2">
      <span className="font-manrope font-medium text-base text-[#121A0F]">
        {title}
      </span>
      <span className="font-manrope font-bold text-2xl text-[#121A0F]">
        Rp {amount}
      </span>
    </div>
  );
};

interface TimeTabProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const TimeTab: React.FC<TimeTabProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-1 px-2 rounded-lg text-sm font-manrope font-medium transition-all duration-200
        ${active ? "bg-white text-[#121A0F] shadow-sm" : "text-[#639154] hover:text-[#121A0F]"}`}
    >
      {label}
    </button>
  );
};

interface TransactionItemProps {
  icon: React.ReactNode;
  amount: string;
  description: string;
  date: string;
  type: "income" | "expense";
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  icon,
  amount,
  description,
  date,
  type,
}) => {
  return (
    <div className="flex justify-between items-center gap-4 px-4 py-2">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#EBF2E8] rounded-lg flex items-center justify-center">
          <div
            className={`w-6 h-6 ${
              type === "income" ? "text-[#088721]" : "text-[#D21B1B]"
            }`}
          >
            {icon}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-manrope font-medium text-base text-[#121A0F]">
            Rp {amount}
          </span>
          <span className="font-manrope text-sm text-[#639154]">
            {description}
          </span>
        </div>
      </div>
      <span className="font-manrope text-sm text-[#639154]">{date}</span>
    </div>
  );
};

export default Dashboard;
