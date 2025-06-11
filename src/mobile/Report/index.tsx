import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import BottomNavigation from '@ui/BottomNavigation';
import { ChartLineSimple } from '@components/Report/ChartLineSimple';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { getApiUrl } from '@/config/api';

// Add type augmentation for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

type TabType = 'ringkasan' | 'pemasukan' | 'pengeluaran';

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: {
    name: string;
    type: "INCOME" | "EXPENSE";
  };
  description: string;
  date: string;
  name?: string;
}

interface ChartData {
  month: string;
  value: number;
}

interface ReportData {
  transactions: Transaction[];
  summary: {
    INCOME: number;
    EXPENSE: number;
  };
  chartData: ChartData[];
  trend: {
    percentage: number;
    isUp: boolean;
  };
}

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
  const [reportData, setReportData] = useState<ReportData>({
    transactions: [],
    summary: { INCOME: 0, EXPENSE: 0 },
    chartData: [],
    trend: { percentage: 0, isUp: true }
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTransactionAmount = (amount: number, type: 'INCOME' | 'EXPENSE') => {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${type === 'INCOME' ? '+' : '-'} Rp ${formatted}`;
  };

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        getApiUrl(`transactions?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    const fetchReportData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      // Get the first day of current month
      const startDate = new Date(currentYear, currentMonth - 1, 1);
      // Get the last day of current month
      const endDate = new Date(currentYear, currentMonth, 0);

      let endpoint = '';
      switch (activeTab) {
        case 'pemasukan':
          endpoint = `/reports/monthly?year=${currentYear}&month=${currentMonth}&type=INCOME`;
          break;
        case 'pengeluaran':
          endpoint = `/reports/monthly?year=${currentYear}&month=${currentMonth}&type=EXPENSE`;
          break;
        default:
          endpoint = `/reports/monthly?year=${currentYear}&month=${currentMonth}`;
      }

      try {
        const res = await fetch(`${getApiUrl(endpoint)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          
          // Get transactions for the current month
          const txRes = await fetch(
            `${getApiUrl("transactions")}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, 
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (txRes.ok) {
            const txData = await txRes.json();
            
            // Format chart data to include proper dates
            const chartData = data.chartData?.map((item: any) => ({
              ...item,
              month: new Date(currentYear, parseInt(item.month) - 1, 1).toISOString()
            })) || [];

            setReportData({
              transactions: txData.transactions,
              summary: txData.summary,
              chartData,
              trend: {
                percentage: data.percentageChange || 0,
                isUp: (data.percentageChange || 0) >= 0
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, [activeTab]);

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate]);

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      setPrevTab(activeTab);
      setActiveTab(tab);
      setSelectedCategory('all');
    }
  };

  const filteredTransactions = reportData.transactions.filter(tx => {
    if (selectedCategory === 'all') return true;
    return tx.category.name.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getCategories = () => {
    const categories = new Set(reportData.transactions.map(tx => tx.category.name));
    return Array.from(categories);
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Laporan Transaksi", 105, 15, { align: "center" });

    // Add date range
    doc.setFontSize(12);
    doc.text(
      `Periode: ${format(startDate, "dd MMMM yyyy", { locale: id })} - ${format(
        endDate,
        "dd MMMM yyyy",
        { locale: id }
      )}`,
      105,
      25,
      { align: "center" }
    );

    // Calculate summary
    const summary = transactions.reduce(
      (acc, curr) => {
        if (curr.type === "INCOME") {
          acc.totalIncome += curr.amount;
        } else {
          acc.totalExpense += curr.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );

    // Add summary section
    doc.text("Ringkasan:", 14, 35);
    doc.text(`Total Pemasukan: ${formatCurrency(summary.totalIncome)}`, 14, 45);
    doc.text(`Total Pengeluaran: ${formatCurrency(summary.totalExpense)}`, 14, 55);
    doc.text(
      `Saldo: ${formatCurrency(summary.totalIncome - summary.totalExpense)}`,
      14,
      65
    );

    // Add transactions table
    const tableData = transactions.map((t) => [
      format(new Date(t.date), "dd/MM/yyyy"),
      t.category.name,
      t.description || "-",
      t.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
      formatCurrency(t.amount),
    ]);

    (doc as any).autoTable({
      startY: 75,
      head: [["Tanggal", "Kategori", "Deskripsi", "Tipe", "Jumlah"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [84, 209, 43],
      },
      alternateRowStyles: {
        fillColor: [235, 242, 232],
      },
    });

    doc.save("laporan-transaksi.pdf");
  };

  const renderContent = () => {
    const categories = getCategories();
    const totalAmount = activeTab === 'pemasukan' 
      ? reportData.summary.INCOME 
      : activeTab === 'pengeluaran' 
        ? reportData.summary.EXPENSE 
        : reportData.summary.INCOME - reportData.summary.EXPENSE;

    return (
      <>
        <div className="px-4 pt-5 pb-3">
          <h2 className="font-inter font-bold text-[22px] text-[#111611]">
            {activeTab === 'ringkasan' ? 'Pemasukan vs. Pengeluaran' :
             activeTab === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
          </h2>
        </div>

        <div className="px-4 py-6">
          <ChartLineSimple 
            title={activeTab === 'ringkasan' ? 'Pemasukan vs. Pengeluaran' :
                  activeTab === 'pemasukan' ? 'Tren Pemasukan' : 'Tren Pengeluaran'}
            amount={formatCurrency(totalAmount)}
            trend={reportData.trend}
            data={reportData.chartData}
            shouldAnimate={activeTab !== prevTab}
          />
        </div>

        <div className="px-4 pt-5 pb-3">
          <h2 className="font-inter font-bold text-[22px] text-[#111611]">Transaksi</h2>
        </div>

        <div className="flex gap-3 px-3 overflow-x-auto">
          <button 
            className={`h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center ${
              selectedCategory === 'all' ? 'bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]' : ''
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            <span className={`font-inter text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'all' ? 'text-[#111611]' : 'text-[#639154]'
            }`}>
              Semua
            </span>
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className={`h-8 bg-[#EBF2E8] rounded-2xl px-4 flex items-center ${
                selectedCategory === category.toLowerCase() ? 'bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]' : ''
              }`}
              onClick={() => setSelectedCategory(category.toLowerCase())}
            >
              <span className={`font-inter text-sm font-medium whitespace-nowrap ${
                selectedCategory === category.toLowerCase() ? 'text-[#111611]' : 'text-[#639154]'
              }`}>
                {category}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col mt-2">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                title={tx.name}
                type={tx.category.name}
                description={tx.description}
                amount={formatTransactionAmount(tx.amount, tx.type)}
                icon={tx.type === 'INCOME' ? <ArrowUpRight className="stroke-[2]" /> : <ArrowDownLeft className="stroke-[2]" />}
                isExpense={tx.type === 'EXPENSE'}
              />
            ))
          ) : (
            <div className="flex justify-center items-center py-8 text-gray-500">
              Tidak ada transaksi
            </div>
          )}
        </div>
      </>
    );
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
        <button 
          onClick={generatePDF}
          className="flex items-center gap-4 bg-[#54D12B] rounded-[28px] py-4 px-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          <FileText className="w-6 h-6 text-[#0F1417]" />
          <span className="font-inter text-base font-bold text-[#0F1417]">Ekspor PDF</span>
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Report; 