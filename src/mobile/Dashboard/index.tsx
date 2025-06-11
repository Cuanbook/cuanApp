import React, { useState, useEffect } from "react";

import { ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";

import { TransactionFormData } from "@components/Dashboard/TransactionForm";
import TransactionModal from "@components/Dashboard/TransactionModal";
// @ts-ignore
import { ChartBar } from "@components/Dashboard/ChartBar";
import BottomNavigation from "@ui/BottomNavigation";

type TimePeriod = 'daily' | 'weekly' | 'monthly';

interface FinancialData {
  income: number;
  expense: number;
  balance: number;
  percentageChange: number;
  chartData: { month: string; value: number }[];
}

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  name: string;
  description?: string;
  date: string;
  category: { name: string; type: string };
}

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('monthly');
  const [animatingHeights, setAnimatingHeights] = useState<number[]>([]);
  const [summary, setSummary] = useState<FinancialData>({
    income: 0,
    expense: 0,
    balance: 0,
    percentageChange: 0,
    chartData: [],
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch summary and transactions from backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      let summaryUrl = '';
      let chartLabels: string[] = [];
      const now = new Date();

      if (selectedPeriod === 'daily') {
        const date = now.toISOString().slice(0, 10);
        summaryUrl = `http://localhost:3000/api/reports/daily?date=${date}`;
        chartLabels = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
      } else if (selectedPeriod === 'weekly') {
        // Get ISO week number
        const getWeek = (d: Date) => {
          d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
          const dayNum = d.getUTCDay() || 7;
          d.setUTCDate(d.getUTCDate() + 4 - dayNum);
          const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
          return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1)/7);
        };
        const week = getWeek(now);
        summaryUrl = `http://localhost:3000/api/reports/weekly?year=${now.getFullYear()}&week=${week}`;
        chartLabels = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      } else {
        summaryUrl = `http://localhost:3000/api/reports/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`;
        chartLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      }

      // Fetch summary
      const resSummary = await fetch(summaryUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resSummary.ok) {
        const data = await resSummary.json();
        setSummary({
          income: data.totalIncome || 0,
          expense: data.totalExpense || 0,
          balance: (data.totalIncome || 0) - (data.totalExpense || 0),
          percentageChange: data.percentageChange || 0,
          chartData: data.chartData || chartLabels.map((label: string) => ({ month: label, value: 0 })),
        });
      } else {
        setSummary({
          income: 0,
          expense: 0,
          balance: 0,
          percentageChange: 0,
          chartData: chartLabels.map((label: string) => ({ month: label, value: 0 })),
        });
      }

      // Fetch latest transactions
      const resTx = await fetch('http://localhost:3000/api/transactions?limit=5', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resTx.ok) {
        const data = await resTx.json();
        setTransactions(data.transactions || []);
      }
    };
    fetchData();
  }, [selectedPeriod]);

  // Chart animation
  useEffect(() => {
    setAnimatingHeights(new Array(summary.chartData.length).fill(0));
    const timer = setTimeout(() => {
      setAnimatingHeights(summary.chartData.map(d => Math.min(100, Math.round((d.value / Math.max(...summary.chartData.map(c => c.value), 1)) * 100))));
    }, 50);
    return () => clearTimeout(timer);
  }, [summary.chartData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveTransaction = (data: TransactionFormData) => {
    // TODO: Implement saving transaction to backend
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
            <FinancialCard title="Pemasukan" amount={formatCurrency(summary.income)} />
            <FinancialCard title="Pengeluaran" amount={formatCurrency(summary.expense)} />
            <FinancialCard title="Saldo" amount={formatCurrency(summary.balance)} />
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
                  Rp {formatCurrency(summary.balance)}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[#639154] text-base">{getPeriodLabel(selectedPeriod)}</span>
                  <span className="text-[#088721] font-medium text-base">
                    +{summary.percentageChange}%
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="overflow-x-auto w-full">
                <div className="flex gap-6 px-3 mt-4 min-w-[600px]">
                  {summary.chartData.map((d, index) => (
                    <div key={d.month} className="flex flex-col items-end gap-6 flex-1 min-w-[40px]">
                      <div className="relative w-full h-[137px]">
                        <div 
                          className="absolute bottom-0 w-full bg-[#EBF2E8] border-t-2 border-[#757575] transition-all duration-500 ease-out" 
                          style={{ 
                            height: `${animatingHeights[index]}%`,
                            transformOrigin: 'bottom'
                          }} 
                        />
                      </div>
                      <span className="font-manrope font-bold text-[13px] text-[#639154]">
                        {d.month}
                      </span>
                    </div>
                  ))}
                </div>
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
            {transactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                icon={tx.type === "INCOME" ? <ArrowUpRight className="stroke-[2.5]" /> : <ArrowDownLeft className="stroke-[2.5]" />}
                amount={formatCurrency(tx.amount)}
                description={tx.name}
                date={new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                type={tx.type === "INCOME" ? "income" : "expense"}
              />
            ))}
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
