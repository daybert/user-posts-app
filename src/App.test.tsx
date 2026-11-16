import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the header title correctly', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error'))
    );
    render(<App />);
    expect(screen.getByText('User & Posts Explorer')).toBeInTheDocument();
  });

  it('renders "API Conectada" when API request succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: 1, name: 'Test User' }],
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('API Conectada')).toBeInTheDocument();
    });
  });

  it('renders "API Conectada" when API responds with 304 Not Modified', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 304,
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('API Conectada')).toBeInTheDocument();
    });
  });

  it('does not render "API Conectada" when API request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    render(<App />);

    expect(screen.queryByText('API Conectada')).not.toBeInTheDocument();
  });
});
