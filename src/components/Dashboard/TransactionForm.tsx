import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { transactionService } from '@/lib/services/transaction';
import { toast } from 'react-hot-toast';

// @ts-ignore
import 'react-datepicker/dist/react-datepicker.css';
import CategoryModal from './CategoryModal';

// Custom styles for the date picker
const datePickerStyles = `
  .react-datepicker {
    font-family: 'Inter', sans-serif;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .react-datepicker__header {
    background-color: #FAFAFA;
    border-bottom: 1px solid #E5E7EB;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding-top: 12px;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #54D12B !important;
    border-radius: 50%;
    color: white !important;
  }
  .react-datepicker__day:hover {
    border-radius: 50%;
  }
  .react-datepicker__day {
    border-radius: 50%;
    margin: 0.2rem;
  }
  .react-datepicker__current-month {
    font-weight: 600;
    color: #0D141C;
  }
  .react-datepicker__navigation {
    top: 12px;
  }
  .react-datepicker__day-name {
    color: #6B7280;
  }
`;

interface TransactionFormProps {
  type: 'income' | 'expense';
  onClose: () => void;
  onSave: (data: TransactionFormData) => void;
  isSubmitting?: boolean;
}

export interface TransactionFormData {
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  categoryId: string;
  name: string;
  description?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  onClose,
  onSave,
  isSubmitting = false,
}) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData & { categoryName?: string }>({
    type: type === 'income' ? 'INCOME' : 'EXPENSE',
    amount: 0,
    date: new Date().toISOString(),
    categoryId: '',
    categoryName: '',
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    // Add custom styles to head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = datePickerStyles;
    document.head.appendChild(styleSheet);

    // Hide bottom navigation when form is mounted
    const bottomNav = document.querySelector('[data-testid="bottom-navigation"]');
    if (bottomNav instanceof HTMLElement) {
      bottomNav.style.display = 'none';
      bottomNav.style.visibility = 'hidden';
      bottomNav.style.opacity = '0';
      bottomNav.style.pointerEvents = 'none';
    }

    return () => {
      document.head.removeChild(styleSheet);
      // Show bottom navigation when form is unmounted
      const bottomNav = document.querySelector('[data-testid="bottom-navigation"]');
      if (bottomNav instanceof HTMLElement) {
        bottomNav.style.display = '';
        bottomNav.style.visibility = '';
        bottomNav.style.opacity = '';
        bottomNav.style.pointerEvents = '';
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast.error('Pilih kategori terlebih dahulu');
      return;
    }

    if (!formData.name) {
      toast.error('Masukkan nama transaksi');
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      toast.error('Masukkan jumlah yang valid');
      return;
    }
    
    try {
      // Convert amount to number and remove categoryName before sending to API
      const { categoryName, ...dataToSubmit } = {
        ...formData,
        amount: Number(formData.amount)
      };
      await onSave(dataToSubmit);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? value.replace(/[^0-9]/g, '') : value 
    }));
  };

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setFormData(prev => ({ 
      ...prev, 
      categoryId,
      categoryName,
    }));
    setShowCategoryModal(false);
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, date: date ? date.toISOString() : new Date().toISOString() }));
    setShowDatePicker(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999]">
      <div className="flex flex-col h-full bg-[#FAFAFA]">
        {/* Header */}
        <div className="flex items-center w-full mb-8 relative py-5 px-4">
          <button 
            type="button"
            onClick={onClose}
            className="absolute left-0 p-2"
          >
            <ArrowLeft className="w-6 h-6 text-[#111611]" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-bold text-[#111611] text-lg font-['Manrope',Helvetica]">
              {type === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Name Field */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama transaksi"
              className="w-full h-[56px] bg-[#EBF2E8] rounded-xl px-4 text-[#639154] placeholder-[#639154] font-inter"
            />
          </div>

          {/* Amount Field */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              Jumlah
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-inter text-[#639154]">
                Rp
              </span>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full h-[56px] bg-[#EBF2E8] rounded-xl pl-12 pr-4 text-[#639154] font-inter"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category Field */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              Kategori
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="relative w-full h-[56px] bg-[#EBF2E8] rounded-xl text-left"
            >
              <span className={`px-4 font-inter ${formData.categoryName ? 'text-[#639154]' : 'text-[#639154]'}`}>
                {formData.categoryName || 'Pilih Kategori'}
              </span>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#639154]" />
            </button>
          </div>

          {/* Date Field */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              Tanggal
            </label>
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="relative w-full h-[56px] bg-[#EBF2E8] rounded-xl text-left"
            >
              <span className="px-4 font-inter text-[#639154]">
                {formatDate(formData.date ? new Date(formData.date) : null)}
              </span>
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#639154]" />
            </button>
          </div>

          {/* Description Field */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              Deskripsi (Opsional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tambahkan deskripsi"
              className="w-full h-[120px] bg-[#EBF2E8] rounded-xl p-4 text-[#639154] placeholder-[#639154] font-inter resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-auto p-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-[56px] rounded-xl font-inter font-bold text-base ${
                isSubmitting
                  ? 'bg-[#EBF2E8] text-[#639154] cursor-not-allowed'
                  : 'bg-[#54D12B] text-[#12190F]'
              }`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>

        {showCategoryModal && (
          <CategoryModal
            type={type}
            selectedCategoryId={formData.categoryId}
            onSelect={handleCategorySelect}
            onClose={() => setShowCategoryModal(false)}
          />
        )}

        {showDatePicker && (
          <div className="fixed inset-0 bg-black/30 z-[99999] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-4">
              <DatePicker
                selected={formData.date ? new Date(formData.date) : null}
                onChange={handleDateChange}
                inline
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionForm; 