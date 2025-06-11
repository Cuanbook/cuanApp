import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionCard from '../components/Transaction/TransactionCard';

describe('TransactionCard', () => {
  it('render tanpa crash', () => {
    render(<TransactionCard title="Test" amount={1000} date="2024-01-01" type="income" />);
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
    expect(screen.getByText(/1000|1.000|Rp/i)).toBeInTheDocument();
  });
}); 