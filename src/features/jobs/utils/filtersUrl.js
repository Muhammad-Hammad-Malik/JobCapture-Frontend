export function readFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    stack: params.get('stack') || '',
    remoteType: params.get('remoteType') || '',
    minExperience: params.get('minExperience') || '',
    maxExperience: params.get('maxExperience') || '',
    page: parseInt(params.get('page'), 10) || 1,
  };
}

export function writeFiltersToUrl(f) {
  const params = new URLSearchParams();
  if (f.search) params.set('search', f.search);
  if (f.stack) params.set('stack', f.stack);
  if (f.remoteType) params.set('remoteType', f.remoteType);
  if (f.minExperience !== '') params.set('minExperience', f.minExperience);
  if (f.maxExperience !== '') params.set('maxExperience', f.maxExperience);
  if (f.page > 1) params.set('page', f.page);
  const query = params.toString();
  window.history.replaceState(null, '', query ? `${window.location.pathname}?${query}` : window.location.pathname);
}
