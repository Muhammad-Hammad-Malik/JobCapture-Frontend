import { apiGet } from '@/lib/apiClient';
import { PAGE_SIZE } from '../constants';

export function fetchJobs(filters, signal) {
  const params = {
    page: filters.page || 1,
    limit: filters.limit || PAGE_SIZE,
  };
  if (filters.stack) params.stack = filters.stack;
  if (filters.remoteType) params.remoteType = filters.remoteType;
  if (filters.minExperience !== '' && filters.minExperience != null) {
    params.minExperience = filters.minExperience;
  }
  if (filters.maxExperience !== '' && filters.maxExperience != null) {
    params.maxExperience = filters.maxExperience;
  }
  if (filters.search) params.search = filters.search;

  return apiGet('/api/jobs', { params, signal });
}
