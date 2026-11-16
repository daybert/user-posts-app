import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('renders the header and title correctly', () => {
    render(<App />);
    expect(screen.getByText('User Posts App')).toBeInTheDocument();
  });

  it('renders initial posts', () => {
    render(<App />);
    expect(screen.getByText('Primer post del proyecto')).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum dolor sit amet/i)).toBeInTheDocument();
  });

  it('renders action button', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /nuevo post/i })
    ).toBeInTheDocument();
  });
});
