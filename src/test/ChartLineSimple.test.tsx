import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartLineSimple } from '../components/Report/ChartLineSimple';

describe('ChartLineSimple', () => {
  it('render tanpa crash', () => {
    render(
      <ChartLineSimple 
        title="Test Chart"
        amount="1000"
        trend={{ percentage: 10, isUp: true }}
        data={[{ month: '2023-01', value: 100 }]}
        shouldAnimate={false}
      />
    );
    // Contoh: cek apakah ada elemen utama chart
    expect(screen.getByTestId('chart-line-simple')).toBeInTheDocument();
  });
}); 