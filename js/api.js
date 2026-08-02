const Api = (() => {
  async function fetchJobs(filters) {
    const params = new URLSearchParams();
    params.set('page', filters.page || 1);
    params.set('limit', filters.limit || 12);
    if (filters.stack) params.set('stack', filters.stack);
    if (filters.remoteType) params.set('remoteType', filters.remoteType);
    if (filters.minExperience !== '' && filters.minExperience != null) {
      params.set('minExperience', filters.minExperience);
    }
    if (filters.maxExperience !== '' && filters.maxExperience != null) {
      params.set('maxExperience', filters.maxExperience);
    }
    if (filters.search) params.set('search', filters.search);

    const response = await fetch(`${API_BASE_URL}/api/jobs?${params.toString()}`);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message || `Request failed (${response.status})`);
    }
    return response.json();
  }

  return { fetchJobs };
})();
