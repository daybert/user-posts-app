import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as api from '../services/api';
import { mockUsers, mockPosts } from './mocks';

describe('App Integration Flow', () => {
  beforeEach(() => {
    vi.spyOn(api, 'fetchUsers').mockResolvedValue(mockUsers);
    vi.spyOn(api, 'fetchPostsByUser').mockResolvedValue(mockPosts);
    vi.spyOn(api, 'createPost').mockImplementation(async (payload) => ({
      userId: payload.userId,
      id: 101,
      title: payload.title,
      body: payload.body,
      isLocal: true,
      createdAt: '12:00',
    }));
  });

  it('carga la lista de usuarios, permite seleccionar uno, ver sus posts y crear una publicación', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Verificar carga inicial de usuarios
    expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
    });

    // 2. Verificar estado inicial de publicaciones (ningún usuario seleccionado)
    expect(
      screen.getByText(/ningún usuario seleccionado/i)
    ).toBeInTheDocument();

    // 3. Seleccionar a "Leanne Graham"
    const userCard = screen.getByRole('button', {
      name: /ver publicaciones de Leanne Graham/i,
    });
    await user.click(userCard);

    // Debe cargar publicaciones del usuario seleccionado
    await waitFor(() => {
      expect(
        screen.getByText(
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('qui est esse')).toBeInTheDocument();
    });

    // 4. Crear una nueva publicación
    const openFormBtn = screen.getByRole('button', {
      name: /nueva publicación para Leanne Graham/i,
    });
    await user.click(openFormBtn);

    const titleInput = screen.getByLabelText(/título/i);
    const bodyInput = screen.getByLabelText(/texto de la publicación/i);
    const submitBtn = screen.getByRole('button', { name: /publicar/i });

    await user.type(titleInput, 'Post creado por el tester');
    await user.type(
      bodyInput,
      'Contenido de la nueva publicación agregada a la lista.'
    );
    await user.click(submitBtn);

    // 5. Verificar que la nueva publicación aparece en la lista con el badge "Nueva"
    await waitFor(() => {
      expect(screen.getByText('Post creado por el tester')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Contenido de la nueva publicación agregada a la lista.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByTitle(
          /esta publicación fue creada durante tu sesión actual/i
        )
      ).toBeInTheDocument();
    });
  });

  it('muestra estado de error si falla la carga de posts y permite reintentar', async () => {
    const user = userEvent.setup();
    vi.spyOn(api, 'fetchPostsByUser').mockRejectedValueOnce(
      new Error('Fallo temporal de servidor')
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    // Seleccionar usuario
    const userCard = screen.getByRole('button', {
      name: /ver publicaciones de Leanne Graham/i,
    });
    await user.click(userCard);

    // Debe mostrar error en el panel de posts
    await waitFor(() => {
      expect(
        screen.getByText(/error al cargar las publicaciones/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/fallo temporal de servidor/i)
      ).toBeInTheDocument();
    });

    // Reintentar exitosamente
    vi.spyOn(api, 'fetchPostsByUser').mockResolvedValueOnce(mockPosts);
    const retryBtn = screen.getByRole('button', { name: /reintentar/i });
    await user.click(retryBtn);

    await waitFor(() => {
      expect(
        screen.getByText(
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
        )
      ).toBeInTheDocument();
    });
  });
});
