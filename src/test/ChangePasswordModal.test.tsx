import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ChangePasswordModal from '../components/Account/ChangePasswordModal';

describe('ChangePasswordModal', () => {
  it('render tanpa crash', () => {
    render(
      <ChangePasswordModal isOpen={true} onClose={() => {}} onSave={() => {}} />
    );
    // Cek judul modal atau placeholder input
    expect(screen.getByText(/Kata Sandi/i)).toBeInTheDocument();
  });
});