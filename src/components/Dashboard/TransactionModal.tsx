import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import TransactionForm, { TransactionFormData } from './TransactionForm';
import { toast } from 'react-hot-toast';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TransactionFormData) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedType, setSelectedType] = React.useState<'income' | 'expense' | null>(null);
  const [activeButton, setActiveButton] = React.useState<'income' | 'expense' | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      // Hide bottom navigation when modal is open
      const bottomNav = document.querySelector('[data-testid="bottom-navigation"]');
      if (bottomNav instanceof HTMLElement) {
        bottomNav.style.display = 'none';
        bottomNav.style.visibility = 'hidden';
        bottomNav.style.opacity = '0';
        bottomNav.style.pointerEvents = 'none';
      }
    }

    return () => {
      // Show bottom navigation when modal closes
      const bottomNav = document.querySelector('[data-testid="bottom-navigation"]');
      if (bottomNav instanceof HTMLElement) {
        bottomNav.style.display = '';
        bottomNav.style.visibility = '';
        bottomNav.style.opacity = '';
        bottomNav.style.pointerEvents = '';
      }
    };
  }, [isOpen]);

  const handleSave = async (data: TransactionFormData) => {
    try {
      setIsSubmitting(true);
      await onSave(data);
      setSelectedType(null);
      setActiveButton(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (selectedType) {
    return (
      <TransactionForm
        type={selectedType}
        onClose={() => {
          setSelectedType(null);
          setActiveButton(null);
          onClose();
        }}
        onSave={handleSave}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[9999]">
      <div className="flex flex-col h-full bg-[#FAFAFA]">
        {/* Header */}
        <div className="flex items-center w-full mb-8 relative py-5 px-4">
          <button 
            onClick={onClose}
            className="absolute left-0 p-2"
          >
            <ArrowLeft className="w-6 h-6 text-[#111611]" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-bold text-[#111611] text-lg font-['Manrope',Helvetica]">
              Tambah Transaksi
            </h1>
          </div>
        </div>

        {/* Transaction Type Selection */}
        <div className="flex flex-col gap-3 px-4 py-3">
          <button
            onClick={() => {
              setActiveButton('income');
              setSelectedType('income');
            }}
            className={`w-full h-12 flex items-center justify-center rounded-[24px] ${
              activeButton === 'income' ? 'bg-[#54D12B]' : 'bg-[#EBF2E8]'
            }`}
          >
            <span className={`font-inter font-bold text-base ${
              activeButton === 'income' ? 'text-[#12190F]' : 'text-[#0D141C]'
            }`}>
              Tambah Pemasukan
            </span>
          </button>
          <button
            onClick={() => {
              setActiveButton('expense');
              setSelectedType('expense');
            }}
            className={`w-full h-12 flex items-center justify-center rounded-[24px] ${
              activeButton === 'expense' ? 'bg-[#54D12B]' : 'bg-[#EBF2E8]'
            }`}
          >
            <span className={`font-inter font-bold text-base ${
              activeButton === 'expense' ? 'text-[#12190F]' : 'text-[#0D141C]'
            }`}>
              Tambah Pengeluaran
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal; 