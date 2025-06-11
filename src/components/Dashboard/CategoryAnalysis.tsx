import React, { useState, useEffect } from 'react';
import { PieChart } from 'lucide-react';
import { getApiUrl } from '@/config/api';

interface CategorySummary {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  type: "INCOME" | "EXPENSE";
}

interface CategoryAnalysisProps {
  period: 'daily' | 'weekly' | 'monthly';
  date?: string;
  year?: number;
  month?: number;
  week?: number;
}

interface CategoryData {
  income: CategorySummary[];
  expense: CategorySummary[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const CategoryItem: React.FC<{ category: CategorySummary }> = ({ category }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          category.type === "INCOME" ? "bg-[#EBF2E8]" : "bg-[#FFEBEB]"
        }`}>
          <PieChart className={`w-5 h-5 ${
            category.type === "INCOME" ? "text-[#088721]" : "text-[#D21B1B]"
          }`} />
        </div>
        <div className="flex flex-col">
          <span className="font-manrope font-medium text-sm text-[#121A0F]">
            {category.categoryName}
          </span>
          <span className="font-manrope text-xs text-[#639154]">
            {category.percentage}% dari total
          </span>
        </div>
      </div>
      <span className="font-manrope font-medium text-sm text-[#121A0F]">
        Rp {formatCurrency(category.amount)}
      </span>
    </div>
  );
};

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({ period, date, year, month, week }) => {
  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token not found');
          return;
        }

        let url = getApiUrl('reports');
        const now = new Date();

        switch (period) {
          case 'daily':
            url += `/daily/categories?date=${date || now.toISOString().slice(0, 10)}`;
            break;
          case 'weekly':
            url += `/weekly/categories?year=${year || now.getFullYear()}&week=${week || 1}`;
            break;
          case 'monthly':
            url += `/monthly/categories?year=${year || now.getFullYear()}&month=${month || now.getMonth() + 1}`;
            break;
        }

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch category analysis');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, date, year, month, week]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Income Categories */}
      {data.income.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-manrope font-bold text-lg text-[#121A0F] mb-2">
            Kategori Pemasukan
          </h3>
          <div className="divide-y divide-gray-100">
            {data.income.map((category) => (
              <CategoryItem key={category.categoryId} category={category} />
            ))}
          </div>
        </div>
      )}

      {/* Expense Categories */}
      {data.expense.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-manrope font-bold text-lg text-[#121A0F] mb-2">
            Kategori Pengeluaran
          </h3>
          <div className="divide-y divide-gray-100">
            {data.expense.map((category) => (
              <CategoryItem key={category.categoryId} category={category} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAnalysis; 