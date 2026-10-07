import { useEffect, useState } from 'react';
import { fetchJobs } from '../api/jobsApi';
import { EMPTY_FILTERS, PAGE_SIZE } from '../constants';
import { readFiltersFromUrl, writeFiltersToUrl } from '../utils/filtersUrl';

// Owns the filter state (synced to the URL) and the fetched job list.
export function useJobs() {
  const [filters, setFilters] = useState(readFiltersFromUrl);
  const [status, setStatus] = useState('loading'); // loading | error | results
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    writeFiltersToUrl(filters);
    const controller = new AbortController();
    setStatus('loading');
    fetchJobs({ ...filters, limit: PAGE_SIZE }, controller.signal)
      .then(data => {
        setResult(data);
        setStatus('results');
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Something went wrong.');
        setStatus('error');
      });
    return () => controller.abort();
  }, [filters, reloadToken]);

  return {
    filters,
    status,
    result,
    error,
    // Change several filter fields at once; always returns to page 1.
    patchFilters: patch => setFilters(f => ({ ...f, ...patch, page: 1 })),
    updateFilter: (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 })),
    // Add/remove one value of a multi-select filter.
    toggleValue: (key, value) =>
      setFilters(f => ({
        ...f,
        [key]: f[key].includes(value) ? f[key].filter(v => v !== value) : [...f[key], value],
        page: 1,
      })),
    removeValue: (key, value) =>
      setFilters(f => ({ ...f, [key]: Array.isArray(f[key]) ? f[key].filter(v => v !== value) : '', page: 1 })),
    clearFilters: () => setFilters({ ...EMPTY_FILTERS, page: 1 }),
    goToPage: page => setFilters(f => ({ ...f, page })),
    retry: () => setReloadToken(t => t + 1),
  };
}
