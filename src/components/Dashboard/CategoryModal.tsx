import React, { useEffect } from 'react';

interface CategoryModalProps {
  type: 'income' | 'expense';
  selectedCategory?: string;
  onSelect: (category: string) => void;
  onClose: () => void;
}

const incomeCategories = [
  'Penjualan Produk',
  'Investasi Masuk',
  'Biaya Konsultasi',
  'Pendapatan Sewa',
  'Lainnya',
];

const expenseCategories = [
  'Operasional',
  'Gaji Karyawan',
  'Transportasi',
  'Pembelian Kebutuhan',
  'Lainnya',
];

const CategoryModal: React.FC<CategoryModalProps> = ({
  type,
  selectedCategory: initialSelectedCategory,
  onSelect,
  onClose,
}) => {
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(initialSelectedCategory || null);

  useEffect(() => {
    // Hide bottom navigation when modal is open
    const bottomNav = document.querySelector('[data-testid="bottom-navigation"]');
    if (bottomNav instanceof HTMLElement) {
      bottomNav.style.display = 'none';
      bottomNav.style.visibility = 'hidden';
      bottomNav.style.opacity = '0';
      bottomNav.style.pointerEvents = 'none';
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
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onSelect(category);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-[99999]">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="absolute bottom-0 left-0 right-0 bg-[#FAFAFA] rounded-t-[32px] z-[100000]">
        {/* Handle bar */}
        <div className="flex justify-center pt-4 pb-6">
          <div className="w-[43px] h-[5px] bg-[#E9E9E9] rounded-lg" />
        </div>

        {/* Title */}
        <div className="px-5">
          <h2 className="font-manrope font-bold text-[22px] text-[#111611]">
            {type === 'income' ? 'Kategori Pemasukan' : 'Kategori Pengeluaran'}
          </h2>
        </div>

        {/* Category List */}
        <div className="flex flex-col gap-3 p-5 max-h-[400px] overflow-y-auto pb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="flex items-center justify-between w-full h-[56px] px-5 bg-white border border-[#E8E8E8] rounded-xl"
            >
              <span className="font-inter text-base text-[#111611]">
                {category}
              </span>
              <div className={`relative w-5 h-5 rounded-full border-2 ${
                category === selectedCategory 
                  ? 'border-[#54D12B] bg-[#54D12B]' 
                  : 'border-[#898989]'
              }`}>
                {category === selectedCategory && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal; 