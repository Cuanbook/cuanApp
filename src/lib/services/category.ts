import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  userId: string;
}

export const categoryService = {
  // Get income categories
  getIncomeCategories: async (): Promise<Category[]> => {
    const response = await axios.get(
      `${API_URL}/categories`,
      {
        params: { type: 'INCOME' },
        headers: getAuthHeader(),
      }
    );
    return response.data.categories;
  },

  // Get expense categories
  getExpenseCategories: async (): Promise<Category[]> => {
    const response = await axios.get(
      `${API_URL}/categories`,
      {
        params: { type: 'EXPENSE' },
        headers: getAuthHeader(),
      }
    );
    return response.data.categories;
  },

  // Create a new category
  createCategory: async (data: { name: string; type: 'INCOME' | 'EXPENSE' }): Promise<Category> => {
    const response = await axios.post(`${API_URL}/categories`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    return response.data;
  },
}; 