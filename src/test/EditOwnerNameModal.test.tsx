import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import EditOwnerNameModal from '../components/Account/EditOwnerNameModal';

describe('EditOwnerNameModal', () => {
  it('render tanpa crash', () => {
    render(
      <EditOwnerNameModal isOpen={true} onClose={() => {}} onSave={() => {}} currentName="Test Owner" />
    );
    expect(screen.getByText(/Nama Pemilik|Owner/i)).toBeInTheDocument();
  });
}); 