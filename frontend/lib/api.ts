export interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  address: string;
  city: string;
  createdAt: string;
}

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const API_BASE_URL = 'http://localhost:4000/api';

export async function fetchUsers(searchQuery?: string): Promise<User[]> {
  const url = searchQuery
    ? `${API_BASE_URL}/users?q=${encodeURIComponent(searchQuery)}`
    : `${API_BASE_URL}/users`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: Method.DELETE,
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}
