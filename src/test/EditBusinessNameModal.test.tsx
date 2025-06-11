import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import EditBusinessNameModal from '../components/Account/EditBusinessNameModal';

describe('EditBusinessNameModal', () => {
  it('render tanpa crash', () => {
    render(
      <EditBusinessNameModal isOpen={true} onClose={() => {}} onSave={() => {}} currentName="Test Bisnis" />
    );
    expect(screen.getByText(/Nama Bisnis|Business/i)).toBeInTheDocument();
  });
}); 