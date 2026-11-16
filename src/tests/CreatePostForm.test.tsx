import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreatePostForm } from '../components/CreatePostForm';

describe('CreatePostForm', () => {
  it('valida que el título y el cuerpo sean obligatorios antes de enviar', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(true);

    render(
      <CreatePostForm
        userName="Leanne Graham"
        isSubmitting={false}
        submitError={null}
        onSubmit={handleSubmit}
      />
    );

    // Abrir formulario
    const openBtn = screen.getByRole('button', {
      name: /nueva publicación para Leanne Graham/i,
    });
    await user.click(openBtn);

    // Intentar enviar vacío
    const submitBtn = screen.getByRole('button', { name: /publicar/i });
    await user.click(submitBtn);

    // Debe mostrar errores de validación y NO llamar al onSubmit
    expect(screen.getByText(/el título es obligatorio/i)).toBeInTheDocument();
    expect(
      screen.getByText(/el texto de la publicación es obligatorio/i)
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('permite enviar cuando el formulario es válido y llama a onSubmit', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(true);

    render(
      <CreatePostForm
        userName="Leanne Graham"
        isSubmitting={false}
        submitError={null}
        onSubmit={handleSubmit}
      />
    );

    // Abrir formulario
    await user.click(
      screen.getByRole('button', {
        name: /nueva publicación para Leanne Graham/i,
      })
    );

    // Rellenar campos válidos
    const titleInput = screen.getByLabelText(/título/i);
    const bodyInput = screen.getByLabelText(/texto de la publicación/i);

    await user.type(titleInput, 'Mi primer post');
    await user.type(
      bodyInput,
      'Este es el contenido de prueba para la publicación.'
    );

    const submitBtn = screen.getByRole('button', { name: /publicar/i });
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith(
      'Mi primer post',
      'Este es el contenido de prueba para la publicación.'
    );
  });

  it('muestra estado de carga mientras se publica y error si falla', () => {
    const { rerender } = render(
      <CreatePostForm
        userName="Leanne Graham"
        isSubmitting={true}
        submitError={null}
        onSubmit={vi.fn()}
        initialOpen={true}
      />
    );

    expect(screen.getByText(/publicando.../i)).toBeInTheDocument();

    rerender(
      <CreatePostForm
        userName="Leanne Graham"
        isSubmitting={false}
        submitError="Error al guardar en el servidor"
        onSubmit={vi.fn()}
        initialOpen={true}
      />
    );

    expect(
      screen.getByText('Error al guardar en el servidor')
    ).toBeInTheDocument();
  });
});
