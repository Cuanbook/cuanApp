import React, { useState, useEffect } from "react";

import { ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";

import { TransactionFormData } from "@components/Dashboard/TransactionForm";
import TransactionModal from "@components/Dashboard/TransactionModal";
// @ts-ignore
import { ChartBar } from "@components/Dashboard/ChartBar";
import BottomNavigation from "@ui/BottomNavigation";
import { transactionService } from "@/lib/services/transaction";
import { toast } from "react-hot-toast";
import { getApiUrl } from '@/config/api';

type TimePeriod = 'daily' | 'weekly' | 'monthly';

// Helper function to get ISO week number
const getWeek = (d: Date) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1)/7);
};

interface FinancialData {
  income: number;
  expense: number;
  balance: number;
  percentageChange: number;
  chartData: { month: string; value: number }[];
  incomeTrend: number;
  expenseTrend: number;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
    incomeTrend: 0,
    expenseTrend: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch summary and transactions from backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      let chartLabels: string[] = [];
      const now = new Date();

      if (selectedPeriod === 'daily') {
        // For daily view, use transactions endpoint
        const resTx = await fetch(getApiUrl('transactions'), {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (resTx.ok) {
          const data = await resTx.json();
          const totalIncome = data.summary?.INCOME || 0;
          const totalExpense = data.summary?.EXPENSE || 0;

          // Get yesterday's data for trend calculation
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStart = yesterday.toISOString();

          const resYesterday = await fetch(`${getApiUrl("transactions")}?startDate=${yesterdayStart}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          let incomeTrend = 0;
          let expenseTrend = 0;
          let percentageChange = 0;

          if (resYesterday.ok) {
            const yesterdayData = await resYesterday.json();
            const yesterdayIncome = yesterdayData.summary?.INCOME || 0;
            const yesterdayExpense = yesterdayData.summary?.EXPENSE || 0;

            incomeTrend = yesterdayIncome === 0 ? 0 : Math.round(((totalIncome - yesterdayIncome) / yesterdayIncome) * 100);
            expenseTrend = yesterdayExpense === 0 ? 0 : Math.round(((totalExpense - yesterdayExpense) / yesterdayExpense) * 100);
            
            const todayBalance = totalIncome - totalExpense;
            const yesterdayBalance = yesterdayIncome - yesterdayExpense;
            percentageChange = yesterdayBalance === 0 ? 0 : 
              Math.round(((todayBalance - yesterdayBalance) / Math.abs(yesterdayBalance)) * 100);
          }

          // Create daily chart data with day names
          const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
          const today = new Date();
          const chartData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - i));
            const dayTransactions = data.transactions.filter((t: Transaction) => {
              const txDate = new Date(t.date);
              return txDate.getDate() === date.getDate() &&
                     txDate.getMonth() === date.getMonth() &&
                     txDate.getFullYear() === date.getFullYear();
            });
            
            const value = dayTransactions.reduce((sum: number, t: Transaction) => {
              return t.type === 'EXPENSE' ? sum + t.amount : sum;
            }, 0);

            return {
              month: dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1],
              value: value
            };
          });

          setSummary({
            income: totalIncome,
            expense: totalExpense,
            balance: totalIncome - totalExpense,
            percentageChange,
            chartData,
            incomeTrend,
            expenseTrend,
          });

          setTransactions(data.transactions || []);
        }
      } else if (selectedPeriod === 'weekly') {
        // Get ISO week number
        const week = getWeek(now);
        const resTx = await fetch(getApiUrl('transactions'), {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (resTx.ok) {
          const data = await resTx.json();
          const totalIncome = data.summary?.INCOME || 0;
          const totalExpense = data.summary?.EXPENSE || 0;

          // Calculate weekly data
          const today = new Date();
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          const daysInMonth = endOfMonth.getDate();
          const weeksInMonth = Math.ceil(daysInMonth / 7);

          const chartData = Array.from({ length: weeksInMonth }, (_, weekIndex) => {
            const weekStart = new Date(startOfMonth);
            weekStart.setDate(weekStart.getDate() + (weekIndex * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            const weekTransactions = data.transactions.filter((t: Transaction) => {
              const txDate = new Date(t.date);
              return txDate >= weekStart && txDate <= weekEnd && t.type === 'EXPENSE';
            });

            const weekTotal = weekTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);

            return {
              month: `Minggu ${weekIndex + 1}`,
              value: weekTotal
            };
          });

          setSummary({
            income: totalIncome,
            expense: totalExpense,
            balance: totalIncome - totalExpense,
            percentageChange: data.percentageChange || 0,
            chartData,
            incomeTrend: data.incomeTrend || 0,
            expenseTrend: data.expenseTrend || 0,
          });

          setTransactions(data.transactions || []);
        }
      } else {
        const resTx = await fetch(getApiUrl('transactions'), {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (resTx.ok) {
          const data = await resTx.json();
          const totalIncome = data.summary?.INCOME || 0;
          const totalExpense = data.summary?.EXPENSE || 0;

          // Calculate monthly data
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
          const today = new Date();
          const currentYear = today.getFullYear();

          const chartData = monthNames.map((monthName, index) => {
            const monthStart = new Date(currentYear, index, 1);
            const monthEnd = new Date(currentYear, index + 1, 0);

            const monthTransactions = data.transactions.filter((t: Transaction) => {
              const txDate = new Date(t.date);
              return txDate >= monthStart && txDate <= monthEnd && t.type === 'EXPENSE';
            });

            const monthTotal = monthTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);

            return {
              month: monthName,
              value: monthTotal
            };
          });

          setSummary({
            income: totalIncome,
            expense: totalExpense,
            balance: totalIncome - totalExpense,
            percentageChange: data.percentageChange || 0,
            chartData,
            incomeTrend: data.incomeTrend || 0,
            expenseTrend: data.expenseTrend || 0,
          });
        } else {
          setSummary({
            income: 0,
            expense: 0,
            balance: 0,
            percentageChange: 0,
            chartData: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"].map((label: string) => ({ month: label, value: 0 })),
            incomeTrend: 0,
            expenseTrend: 0,
          });
        }
      }

      // Fetch latest transactions
      const resTx = await fetch(`${getApiUrl("transactions")}?limit=5`, {
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

  const handleSaveTransaction = async (data: TransactionFormData) => {
    try {
      await transactionService.createTransaction(data);
      toast.success(`${data.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'} berhasil ditambahkan`);
    setIsModalOpen(false);
      
      // Refresh data
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch latest transactions
      const resTx = await fetch(`${getApiUrl("transactions")}?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resTx.ok) {
        const data = await resTx.json();
        setTransactions(data.transactions || []);
      }

      // Refresh summary based on selected period
      let summaryUrl = '';
      let chartLabels: string[] = [];
      const now = new Date();

      if (selectedPeriod === 'daily') {
        const date = now.toISOString().slice(0, 10);
        summaryUrl = `${getApiUrl("reports/daily")}?date=${date}`;
        chartLabels = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
      } else if (selectedPeriod === 'weekly') {
        const week = getWeek(now);
        summaryUrl = `${getApiUrl("reports/weekly")}?year=${now.getFullYear()}&week=${week}`;
        chartLabels = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      } else {
        summaryUrl = `${getApiUrl("reports/monthly")}?year=${now.getFullYear()}&month=${now.getMonth() + 1}`;
        chartLabels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      }

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
          incomeTrend: data.incomeTrend || 0,
          expenseTrend: data.expenseTrend || 0,
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan transaksi');
    }
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
            <TrendCard 
              title="Pemasukan" 
              amount={formatCurrency(summary.income)}
              trend={summary.incomeTrend}
              type="income"
            />
            <TrendCard 
              title="Pengeluaran" 
              amount={formatCurrency(summary.expense)}
              trend={summary.expenseTrend}
              type="expense"
            />
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
                  <span className={`font-medium text-base ${summary.percentageChange >= 0 ? 'text-[#088721]' : 'text-[#D21B1B]'}`}>
                    {summary.percentageChange >= 0 ? '+' : ''}{summary.percentageChange}%
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="overflow-x-auto w-full">
                <div className="flex gap-6 px-3 mt-4 min-w-[600px]">
                  {summary.chartData.map((d, index) => {
                    const maxValue = Math.max(...summary.chartData.map(item => item.value));
                    const percentage = maxValue === 0 ? 0 : Math.round((d.value / maxValue) * 100);
                    
                    return (
                      <div key={d.month} className="flex flex-col items-end gap-6 flex-1 min-w-[40px]">
                    <div className="relative w-full h-[137px]">
                      <div 
                        className="absolute bottom-0 w-full bg-[#EBF2E8] border-t-2 border-[#757575] transition-all duration-500 ease-out" 
                        style={{ 
                              height: `${percentage}%`,
                          transformOrigin: 'bottom'
                        }} 
                      />
                    </div>
                    <span className="font-manrope font-bold text-[13px] text-[#639154]">
                          {d.month}
                    </span>
                  </div>
                    );
                  })}
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

interface TrendCardProps {
  title: string;
  amount: string;
  trend: number;
  type: "income" | "expense";
}

const TrendCard: React.FC<TrendCardProps> = ({ title, amount, type }) => {
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
