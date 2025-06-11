import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import BottomNavigation from '@ui/BottomNavigation';
import { ChartLineSimple } from '@components/Report/ChartLineSimple';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type TabType = 'ringkasan' | 'pemasukan' | 'pengeluaran';

const Report: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ringkasan');
  const [prevTab, setPrevTab] = useState<TabType>('ringkasan');
  const [chartData, setChartData] = useState<{ month: string; value: number }[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summaryAmount, setSummaryAmount] = useState(0);
  const [trend, setTrend] = useState<{ percentage: number; isUp: boolean }>({ percentage: 0, isUp: true });
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      let url = '';
      if (activeTab === 'pemasukan') {
        url = 'http://localhost:3000/api/reports/income';
      } else if (activeTab === 'pengeluaran') {
        url = 'http://localhost:3000/api/reports/expense';
      } else {
        // Ringkasan: bisa pakai monthly report
        const now = new Date();
        url = `http://localhost:3000/api/reports/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Untuk chart, backend sebaiknya mengembalikan data bulanan/per kategori
        if (activeTab === 'ringkasan') {
          // Misal: data.chartData = [{month: 'Jan', value: ...}, ...]
          setChartData(data.chartData || []);
          setSummaryAmount(data.totalIncome - data.totalExpense);
          setTrend({ percentage: data.percentageChange || 0, isUp: (data.percentageChange || 0) >= 0 });
          setTransactions(data.transactions || []);
        } else {
          setChartData(data.chartData || []);
          setSummaryAmount(data.total || 0);
          setTrend({ percentage: data.percentageChange || 0, isUp: (data.percentageChange || 0) >= 0 });
          setTransactions(data.transactions || []);
        }
      }
    };
    fetchReport();
  }, [activeTab]);

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      setPrevTab(activeTab);
      setActiveTab(tab);
    }
  };

  const formatCurrency = (amount: number) =>
    'Rp ' + amount.toLocaleString('id-ID', { minimumFractionDigits: 0 });

  const renderContent = () => (
    <>
      <div className="px-4 pt-5 pb-3">
        <h2 className="font-inter font-bold text-[22px] text-[#111611]">
          {activeTab === 'pemasukan'
            ? 'Pemasukan'
            : activeTab === 'pengeluaran'
            ? 'Pengeluaran'
            : 'Pemasukan vs. Pengeluaran'}
        </h2>
      </div>
      <div className="px-4 py-6">
        <ChartLineSimple
          title={
            activeTab === 'pemasukan'
              ? 'Tren Pemasukan'
              : activeTab === 'pengeluaran'
              ? 'Tren Pengeluaran'
              : 'Pemasukan vs. Pengeluaran'
          }
          amount={formatCurrency(summaryAmount)}
          trend={trend}
          data={chartData}
          shouldAnimate={activeTab !== prevTab}
        />
      </div>
      <div className="px-4 pt-5 pb-3">
        <h2 className="font-inter font-bold text-[22px] text-[#111611]">Transaksi</h2>
      </div>
      <div className="flex flex-col mt-2">
        {transactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            title={tx.name}
            type={tx.category?.name || ''}
            amount={`${tx.type === 'EXPENSE' ? '-' : '+'} ${formatCurrency(tx.amount)}`}
            icon={
              tx.type === 'EXPENSE' ? (
                <ArrowDownLeft className="stroke-[2]" />
              ) : (
                <ArrowUpRight className="stroke-[2]" />
              )
            }
            description={tx.description}
            isExpense={tx.type === 'EXPENSE'}
          />
        ))}
      </div>
    </>
  );

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('laporan-cuanbook.pdf');
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
      <div ref={reportRef}>
        {renderContent()}
      </div>
      {/* Export Button */}
      <div className="flex justify-end px-5 py-5">
        <button
          className="flex items-center gap-4 bg-[#54D12B] rounded-[28px] py-4 px-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          onClick={handleExportPDF}
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