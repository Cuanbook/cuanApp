import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from '../components/ui/Icon';

describe('Icon', () => {
  it('render icon dengan nama dan size', () => {
    render(<Icon name="home" size={32} />);
    const img = screen.getByAltText('home');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/icons/home.svg');
    expect(img).toHaveAttribute('width', '32');
    expect(img).toHaveAttribute('height', '32');
  });
}); 