import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface TransactionFormData {
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  categoryId: string;
  name: string;
  description?: string;
}

export interface TransactionResponse {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  categoryId: string;
  name: string;
  description?: string;
  category: {
    name: string;
    type: string;
  };
}

export const transactionService = {
  // Create a new transaction
  createTransaction: async (data: TransactionFormData): Promise<TransactionResponse> => {
    const response = await axios.post(`${API_URL}/transactions`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    return response.data;
  },

  // Get all transactions with optional filters
  getTransactions: async (params?: {
    type?: 'INCOME' | 'EXPENSE';
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const response = await axios.get(
      `${API_URL}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },
}; 