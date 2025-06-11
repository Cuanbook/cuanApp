import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import EditEmailModal from '../components/Account/EditEmailModal';

describe('EditEmailModal', () => {
  it('render tanpa crash', () => {
    render(
      <EditEmailModal isOpen={true} onClose={() => {}} onSave={() => {}} currentEmail="test@email.com" />
    );
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
  });
}); 