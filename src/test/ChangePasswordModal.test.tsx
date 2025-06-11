import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ChangePasswordModal from '../components/Account/ChangePasswordModal';

describe('ChangePasswordModal', () => {
  it('render tanpa crash', () => {
    render(
      <ChangePasswordModal isOpen={true} onClose={() => {}} onSave={() => {}} />
    );
    expect(screen.getByText(/Password/i)).toBeInTheDocument();
  });
}); 