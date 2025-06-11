import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChartLineInteractive } from '../components/Report/ChartLineInteractive';

describe('ChartLineInteractive', () => {
  it('render tanpa crash', () => {
    render(<ChartLineInteractive />);
    // Cek CardTitle dan CardDescription
    expect(screen.getByText(/Tren Pemasukan/i)).toBeInTheDocument();
    expect(screen.getByText(/30 Hari Terakhir/i)).toBeInTheDocument();
    // Cek tombol pemasukan dan pengeluaran (pakai getAllByText karena ada lebih dari satu)
    expect(screen.getAllByText(/Pemasukan/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pengeluaran/i).length).toBeGreaterThan(0);
  });

  it('bisa switch chart antara pemasukan dan pengeluaran', () => {
    render(<ChartLineInteractive />);
    // Default: pemasukan aktif
    expect(screen.getByText(/Tren Pemasukan/i)).toBeInTheDocument();
    // Klik tombol pengeluaran (cari tombol dengan role dan text)
    const pengeluaranButton = screen.getAllByRole('button', { name: /Pengeluaran/i })[0];
    fireEvent.click(pengeluaranButton);
    // Sekarang judul harus berubah
    expect(screen.getByText(/Tren Pengeluaran/i)).toBeInTheDocument();
  });
});
