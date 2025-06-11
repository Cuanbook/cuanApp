import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BaseModal from '../components/ui/BaseModal';

describe('BaseModal', () => {
  it('tidak render saat isOpen false', () => {
    render(
      <BaseModal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Isi Modal</div>
      </BaseModal>
    );
    expect(screen.queryByText(/Isi Modal/i)).not.toBeInTheDocument();
  });

  it('render saat isOpen true dan bisa close', () => {
    const handleClose = jest.fn();
    render(
      <BaseModal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Isi Modal</div>
      </BaseModal>
    );
    expect(screen.getByText(/Isi Modal/i)).toBeInTheDocument();
    const closeIcon = screen.getByText(/Test Modal/i).previousSibling?.firstChild as Element;
    fireEvent.click(closeIcon);
    expect(handleClose).toHaveBeenCalled();
  });
}); 