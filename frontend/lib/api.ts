import { API_BASE_URL, HttpMethod } from './constants';

export interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  address: string;
  city: string;
  createdAt: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    let errorDetails;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorDetails = errorData.details;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, response.status, errorDetails);
  }

  return response.json();
}

export async function fetchUsers(searchQuery?: string): Promise<User[]> {
  const url = searchQuery
    ? `${API_BASE_URL}/users?q=${encodeURIComponent(searchQuery)}`
    : `${API_BASE_URL}/users`;

  try {
    const response = await fetch(url);
    return handleResponse<User[]>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network error or other fetch failure
    throw new ApiError('Failed to connect to server. Please check your connection.', 0);
  }
}

export async function deleteUser(userId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: HttpMethod.DELETE,
    });
    await handleResponse<{ message: string; user: User }>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network error or other fetch failure
    throw new ApiError('Failed to connect to server. Please check your connection.', 0);
  }
}
