import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App — Root Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders the AuthApp component inside it', () => {
    render(<App />);
    // AuthApp renders the OnePiece heading
    expect(screen.getByText('OnePiece')).toBeInTheDocument();
  });

  it('renders the theme toggle button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /light mode/i })).toBeInTheDocument();
  });
});
