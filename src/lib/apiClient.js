import { API_BASE_URL } from '@/config/env';

// Thin fetch wrapper shared by every feature's API module.
export async function apiGet(path, { params, signal } = {}) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  const response = await fetch(`${API_BASE_URL}${path}${query}`, { signal });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Request failed (${response.status})`);
  }
  return response.json();
}
