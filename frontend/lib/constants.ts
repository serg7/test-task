export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
}

export const QUERY_KEYS = {
  USERS: 'users',
  USER: 'user',
} as const;

export const ROUTES = {
  HOME: '/',
} as const;

export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 500,
} as const;
