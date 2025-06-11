import React, { useEffect, useState } from 'react';
import { Category, categoryService } from '@/lib/services/category';
import { toast } from 'react-hot-toast';

interface CategoryModalProps {
  type: 'income' | 'expense';
  selectedCategoryId?: string;
  onSelect: (categoryId: string, categoryName: string) => void;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  type,
  selectedCategoryId: initialSelectedCategoryId,
  onSelect,
  onClose,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialSelectedCategoryId || null);

  useEffect(() => {
    loadCategories();
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
  }, [type]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = type === 'income' 
        ? await categoryService.getIncomeCategories()
        : await categoryService.getExpenseCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Gagal memuat kategori');
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategoryId(category.id);
    onSelect(category.id, category.name);
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
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <span className="text-gray-500">Memuat kategori...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center h-20">
              <span className="text-gray-500">Tidak ada kategori</span>
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className="flex items-center justify-between w-full h-[56px] px-5 bg-white border border-[#E8E8E8] rounded-xl"
              >
                <span className="font-inter text-base text-[#111611]">
                  {category.name}
                </span>
                <div className={`relative w-5 h-5 rounded-full border-2 ${
                  category.id === selectedCategoryId 
                    ? 'border-[#54D12B] bg-[#54D12B]' 
                    : 'border-[#898989]'
                }`}>
                  {category.id === selectedCategoryId && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal; 