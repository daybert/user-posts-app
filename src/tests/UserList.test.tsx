import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserList } from '../components/UserList';
import { mockUsers } from './mocks';

describe('UserList & Search', () => {
  it('renderiza la lista de usuarios y permite filtrar por nombre', async () => {
    const user = userEvent.setup();
    const handleSearchChange = vi.fn();
    const handleSelectUser = vi.fn();
    const handleRetry = vi.fn();

    const { rerender } = render(
      <UserList
        users={mockUsers}
        filteredUsers={mockUsers}
        loading={false}
        error={null}
        searchQuery=""
        onSearchChange={handleSearchChange}
        selectedUser={null}
        onSelectUser={handleSelectUser}
        onRetry={handleRetry}
      />
    );

    // Debe mostrar los nombres de los usuarios
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
    expect(screen.getByText('Clementine Bauch')).toBeInTheDocument();

    // Escribir en la búsqueda
    const searchInput = screen.getByLabelText(/buscar usuario por nombre/i);
    await user.type(searchInput, 'Ervin');
    expect(handleSearchChange).toHaveBeenCalled();

    // Re-render con filteredUsers filtrado
    rerender(
      <UserList
        users={mockUsers}
        filteredUsers={[mockUsers[1]]}
        loading={false}
        error={null}
        searchQuery="Ervin"
        onSearchChange={handleSearchChange}
        selectedUser={null}
        onSelectUser={handleSelectUser}
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
  });

  it('muestra estado vacío cuando no hay coincidencias con la búsqueda', () => {
    render(
      <UserList
        users={mockUsers}
        filteredUsers={[]}
        loading={false}
        error={null}
        searchQuery="UsuarioInexistente"
        onSearchChange={vi.fn()}
        selectedUser={null}
        onSelectUser={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText(/sin resultados/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /no se encontraron usuarios que coincidan con "UsuarioInexistente"/i
      )
    ).toBeInTheDocument();
  });

  it('muestra estado de carga y de error con botón de reintentar', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    // Estado de carga
    const { rerender } = render(
      <UserList
        users={[]}
        filteredUsers={[]}
        loading={true}
        error={null}
        searchQuery=""
        onSearchChange={vi.fn()}
        selectedUser={null}
        onSelectUser={vi.fn()}
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument();

    // Estado de error
    rerender(
      <UserList
        users={[]}
        filteredUsers={[]}
        loading={false}
        error="Error 500 al conectar con la API"
        searchQuery=""
        onSearchChange={vi.fn()}
        selectedUser={null}
        onSelectUser={vi.fn()}
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText(/error al cargar usuarios/i)).toBeInTheDocument();
    expect(
      screen.getByText('Error 500 al conectar con la API')
    ).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /reintentar/i });
    await user.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
