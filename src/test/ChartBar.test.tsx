import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartBar } from '../components/Dashboard/ChartBar';

describe('ChartBar', () => {
  it('render tanpa crash', () => {
    render(<ChartBar data={[{ month: 'Jan', value: 100 }]} />);
    // Cek root chart-bar ada
    expect(screen.getByTestId('chart-bar')).toBeInTheDocument();
  });
});