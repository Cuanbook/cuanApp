import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartLineDefault } from '../components/Report/ChartLineDefault';

describe('ChartLineDefault', () => {
  it('render tanpa crash dan tampilkan title, total, dan trend', () => {
    render(
      <ChartLineDefault
        title="Test Chart"
        data={[{ month: 'January', value: 100 }, { month: 'February', value: 200 }]}
        trend={{ percentage: 10, isUp: true }}
        color="#54D12B"
      />
    );
    expect(screen.getByText(/Test Chart/i)).toBeInTheDocument();
    expect(screen.getByText(/Rp 300/)).toBeInTheDocument();
    expect(screen.getByText('+10%')).toBeInTheDocument();
  });

  it('render trend turun', () => {
    render(
      <ChartLineDefault
        title="Chart Turun"
        data={[{ month: 'January', value: 50 }]}
        trend={{ percentage: 5, isUp: false }}
        color="#FF0505"
      />
    );
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });
}); 