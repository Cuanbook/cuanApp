import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import EditContactModal from '../components/Account/EditContactModal';

describe('EditContactModal', () => {
  it('render tanpa crash', () => {
    render(
      <EditContactModal isOpen={true} onClose={() => {}} onSave={() => {}} currentContact="08123456789" />
    );
    expect(screen.getByText(/Kontak|Contact/i)).toBeInTheDocument();
  });
}); 