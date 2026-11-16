import { BASE_URL } from '../config';
import { User, Post, NewPostInput } from '../types';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new ApiError(
      `Error de red (${response.status}): ${response.statusText || 'Error en la petición'}. ${errorText}`.trim(),
      response.status
    );
  }
  return response.json();
}

// get all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: {
        Accept: 'application/json',
      },
    });
    return await handleResponse<User[]>(response);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      'No fue posible conectar con el servidor. Revisa tu conexión a internet.'
    );
  }
}

// get posts by user
export async function fetchPostsByUser(userId: number): Promise<Post[]> {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/posts`, {
      headers: {
        Accept: 'application/json',
      },
    });
    return await handleResponse<Post[]>(response);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      `Error al cargar las publicaciones del usuario ${userId}.`
    );
  }
}

// Create a new post
export async function createPost(postData: NewPostInput): Promise<Post> {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const created = await handleResponse<Post>(response);
    return {
      ...created,
      isLocal: true,
      createdAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Error al crear la publicación.');
  }
}
