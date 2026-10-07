import { useCallback, useState } from 'react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import Pagination from '@/components/ui/Pagination.jsx';
import { AlertIcon, InboxIcon } from '@/components/ui/Icons.jsx';
import {
  ActiveFilters,
  FilterBar,
  JobCard,
  JobModal,
  SearchBar,
  TrackSwitch,
  getActiveChips,
  useFacets,
  useJobs,
} from '@/features/jobs';

export default function HomePage() {
  const {
    filters, status, result, error,
    patchFilters, updateFilter, toggleValue, removeValue, clearFilters, goToPage, retry,
  } = useJobs();
  const facets = useFacets();
  const [selectedJob, setSelectedJob] = useState(null);
  const closeModal = useCallback(() => setSelectedJob(null), []);

  const jobs = result?.data ?? [];
  const chips = getActiveChips(filters);
  const isEmpty = status === 'results' && jobs.length === 0;
  const showResults = status === 'results' && jobs.length > 0;

  let countNode = null;
  if (showResults) {
    const start = (result.page - 1) * result.limit + 1;
    const end = Math.min(result.page * result.limit, result.total);
    countNode = (
      <>Showing <strong>{start}–{end}</strong> of <strong>{result.total}</strong> role{result.total === 1 ? '' : 's'}</>
    );
  }

  // Switching track drops any selected categories that belong to the other track.
  const handleTrack = track => {
    const trackOf = Object.fromEntries((facets?.categories || []).map(c => [c.name, c.track]));
    const categories = track ? filters.categories.filter(c => trackOf[c] === track) : filters.categories;
    patchFilters({ track, categories });
  };

  const handlePage = page => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />

      <main className="container">
        <div className="page-head">
          <h1 className="page-title">Open roles</h1>
          <p className="page-sub">Fresh openings shared by people we know, updated as they come in.</p>
        </div>

        <div className="board">
          <FilterBar
            filters={filters}
            facets={facets}
            activeCount={chips.length}
            onToggle={toggleValue}
            onUpdate={updateFilter}
            onClear={clearFilters}
          />

          <section aria-label="Results">
            <TrackSwitch value={filters.track} counts={facets?.tracks} total={facets?.total} onChange={handleTrack} />
            <SearchBar value={filters.search} onCommit={v => updateFilter('search', v)} />

            <div className="results-bar">
              <p className="results-count" aria-live="polite">{countNode}</p>
              <ActiveFilters chips={chips} onRemove={removeValue} />
            </div>

            {status === 'loading' && (
              <div className="job-list" aria-busy="true">
                {Array.from({ length: 5 }, (_, i) => <div className="skeleton" key={i} />)}
              </div>
            )}

            {status === 'error' && (
              <div className="state" role="alert">
                <div className="state-icon is-error"><AlertIcon /></div>
                <h2>Couldn’t load jobs</h2>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={retry}>Try again</button>
              </div>
            )}

            {isEmpty && (
              <div className="state">
                <div className="state-icon"><InboxIcon /></div>
                <h2>No roles match your search</h2>
                <p>Try different keywords or remove some filters to see more results.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear all filters</button>
              </div>
            )}

            {showResults && (
              <>
                <div className="job-list">
                  {jobs.map(job => <JobCard key={job._id} job={job} onOpen={setSelectedJob} />)}
                </div>
                <Pagination page={result.page} totalPages={result.totalPages} onPage={handlePage} />
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {selectedJob && <JobModal job={selectedJob} onClose={closeModal} />}
    </>
  );
}
