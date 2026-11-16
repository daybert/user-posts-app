import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { mockUsers } from './tests/mocks';

describe('App component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the header title correctly', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error'))
    );
    render(<App />);
    expect(screen.getByText('User & Posts Explorer')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Error al cargar usuarios')).toBeInTheDocument();
    });
  });

  it('renders "API Conectada" when API request succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockUsers,
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('API Conectada')).toBeInTheDocument();
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });
  });

  it('renders "API Conectada" when API responds with 304 Not Modified', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (url: string) => {
        if (url.includes('_limit=1')) {
          return {
            ok: false,
            status: 304,
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => mockUsers,
        };
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('API Conectada')).toBeInTheDocument();
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });
  });

  it('does not render "API Conectada" and shows "Buscando API..." when API request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server error' }),
      })
    );

    render(<App />);

    expect(screen.queryByText('API Conectada')).not.toBeInTheDocument();
    expect(screen.getByText(/Buscando API\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Error al cargar usuarios')).toBeInTheDocument();
    });
  });
});
