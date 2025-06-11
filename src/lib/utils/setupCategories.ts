import { categoryService } from '../services/category';

const defaultIncomeCategories = [
  'Penjualan Produk',
  'Investasi Masuk',
  'Biaya Konsultasi',
  'Pendapatan Sewa',
  'Lainnya',
];

const defaultExpenseCategories = [
  'Operasional',
  'Gaji Karyawan',
  'Transportasi',
  'Pembelian Kebutuhan',
  'Lainnya',
];

export const setupDefaultCategories = async () => {
  try {
    // Get existing categories
    const existingCategories = await categoryService.getCategories();
    
    if (existingCategories.length === 0) {
      // Create income categories
      const incomePromises = defaultIncomeCategories.map(name =>
        categoryService.createCategory({ name, type: 'INCOME' })
      );
      
      // Create expense categories
      const expensePromises = defaultExpenseCategories.map(name =>
        categoryService.createCategory({ name, type: 'EXPENSE' })
      );
      
      // Wait for all categories to be created
      await Promise.all([...incomePromises, ...expensePromises]);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error setting up default categories:', error);
    return false;
  }
}; 