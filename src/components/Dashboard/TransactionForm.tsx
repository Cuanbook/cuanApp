import React, { useState, useEffect } from 'react';

import { Calendar, ChevronDown, ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';

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
}

export interface TransactionFormData {
  type: string;
  amount: string;
  date: Date | null;
  category: string;
  description: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  onClose,
  onSave,
}) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: '',
    amount: '',
    date: null,
    category: '',
    description: '',
  });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
    setShowCategoryModal(false);
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, date }));
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
          {/* Type */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              {type === 'income' ? 'Jenis Pemasukan' : 'Jenis Pengeluaran'}
            </label>
            <input
              type="text"
              name="type"
              placeholder={`e.g., ${type === 'income' ? 'Penjualan Produk' : 'Pembelian Bahan Baku'}`}
              value={formData.type}
              onChange={handleInputChange}
              className="w-full h-[56px] bg-[#EBF2E8] rounded-xl px-4 text-[#639154] placeholder-[#639154] font-inter"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              Jumlah
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-inter text-[#639154]">
                Rp
              </span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full h-[56px] bg-[#EBF2E8] rounded-xl pl-12 pr-4 text-[#639154] font-inter"
                placeholder="0"
              />
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              Tanggal
            </label>
            <div className="relative">
              <div 
                className="flex w-full h-[56px] bg-[#EBF2E8] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setShowDatePicker(true)}
              >
                <input
                  type="text"
                  readOnly
                  value={formatDate(formData.date)}
                  placeholder="DD/MM/YYYY"
                  className="flex-1 bg-transparent px-4 text-[#639154] placeholder-[#639154] font-inter cursor-pointer"
                />
                <div className="px-4 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#639154]" />
                </div>
              </div>
              {showDatePicker && (
                <div className="absolute z-50 mt-2">
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    inline
                    dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                    calendarClassName="bg-white shadow-lg rounded-lg border border-gray-200"
                    onClickOutside={() => setShowDatePicker(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              Kategori
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="relative w-full h-[56px] bg-[#EBF2E8] rounded-xl text-left"
            >
              <span className={`px-4 font-inter ${formData.category ? 'text-[#639154]' : 'text-[#639154]'}`}>
                {formData.category || 'Pilih Kategori'}
              </span>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#639154]" />
            </button>
          </div>

          {/* Description */}
          <div className="flex flex-col px-4 py-3">
            <label className="font-inter font-medium text-base text-[#0D141C] mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              placeholder="Tambahkan deskripsi singkat"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full min-h-[56px] bg-[#EBF2E8] rounded-xl px-4 py-4 text-[#639154] placeholder-[#639154] font-inter resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="mt-auto px-4 py-3">
            <button
              type="submit"
              className="w-full h-12 bg-[#54D12B] rounded-[24px] font-inter font-bold text-base text-[#0D141C] shadow-md"
            >
              Simpan
            </button>
          </div>
        </form>

        {/* Category Modal */}
        {showCategoryModal && (
          <CategoryModal
            type={type}
            selectedCategory={formData.category}
            onSelect={handleCategorySelect}
            onClose={() => setShowCategoryModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionForm; 