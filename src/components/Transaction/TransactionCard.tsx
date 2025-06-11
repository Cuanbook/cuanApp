import React from 'react';

import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionCardProps {
  title: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  title,
  amount,
  type,
  category,
  date,
}) => {
  const isIncome = type === 'income';
  const Icon = isIncome ? ArrowUpRight : ArrowDownLeft;
  const amountColor = isIncome ? 'text-[#088721]' : 'text-[#D21B1B]';
  const amountPrefix = isIncome ? '+ ' : '- ';

  return (
    <div className="flex justify-between items-center py-2 px-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#EBF2E8] rounded-lg flex items-center justify-center">
          <Icon className={`w-6 h-6 ${amountColor}`} />
        </div>
        <div className="flex flex-col">
          <span className="font-inter text-base font-medium text-[#111611]">{title}</span>
          <span className="font-inter text-sm text-[#639154]">{category}</span>
        </div>
      </div>
      <span className={`font-inter text-base ${amountColor}`}>
        {amountPrefix}{amount}
      </span>
    </div>
  );
};

export default TransactionCard; 