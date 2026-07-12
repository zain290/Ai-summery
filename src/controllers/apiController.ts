const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function apiFetch(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error('API request failed');
  }
  return response.json();
}

export async function getProjects() {
  return apiFetch('/projects');
}

export async function getProject(slug: string) {
  return apiFetch(`/projects/${slug}`);
}

export async function getPage(slug: string) {
  return apiFetch(`/pages/${slug}`);
}

export async function getSettings() {
  return apiFetch('/settings');
}

export async function getNavigation() {
  return apiFetch('/navigation');
}
