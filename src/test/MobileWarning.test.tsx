import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import MobileWarning from '../components/ui/MobileWarning';

describe('MobileWarning', () => {
  it('render komponen MobileWarning dengan benar', () => {
    render(
      <MobileWarning>
        <div>Isi Mobile Warning</div>
      </MobileWarning>
    );
    // Cek text utama yang pasti ada di MobileWarning
    expect(screen.getByText(/Mohon Buka di Perangkat Mobile/i)).toBeInTheDocument();
    expect(screen.getByText(/Aplikasi ini dioptimalkan untuk perangkat mobile/i)).toBeInTheDocument();
  });
}); 