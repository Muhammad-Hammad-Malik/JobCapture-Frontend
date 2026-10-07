import { useCallback, useState } from 'react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import Pagination from '@/components/ui/Pagination.jsx';
import { FilterBar, JobCard, JobModal, useJobs } from '@/features/jobs';

export default function HomePage() {
  const { filters, status, result, error, updateFilter, clearFilters, goToPage, retry } = useJobs();
  const [selectedJob, setSelectedJob] = useState(null);
  const closeModal = useCallback(() => setSelectedJob(null), []);

  const jobs = result?.data ?? [];
  const isEmpty = status === 'results' && jobs.length === 0;
  const showResults = status === 'results' && jobs.length > 0;

  let countText = '';
  if (showResults) {
    const start = (result.page - 1) * result.limit + 1;
    const end = Math.min(result.page * result.limit, result.total);
    countText = `Showing ${start}-${end} of ${result.total} job${result.total === 1 ? '' : 's'}`;
  }

  const handlePage = page => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />

      <main className="container">
        <FilterBar filters={filters} onChange={updateFilter} onClear={clearFilters} />

        <div className="results-meta">
          <p aria-live="polite">{countText}</p>
        </div>

        {status === 'loading' && (
          <section className="state-panel">
            <div className="skeleton-grid">
              {Array.from({ length: 6 }, (_, i) => <div className="skeleton-card" key={i}></div>)}
            </div>
          </section>
        )}

        {status === 'error' && (
          <section className="state-panel">
            <div className="empty-state">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <h2>Couldn't load jobs</h2>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={retry}>Try again</button>
            </div>
          </section>
        )}

        {isEmpty && (
          <section className="state-panel">
            <div className="empty-state">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7l8-4 8 4-8 4-8-4zM4 7v10l8 4 8-4V7M12 11v10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
              <h2>No jobs match those filters</h2>
              <p>Try widening your search or clearing a filter.</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear filters</button>
            </div>
          </section>
        )}

        {showResults && (
          <>
            <section className="job-grid" aria-live="polite">
              {jobs.map(job => <JobCard key={job._id} job={job} onOpen={setSelectedJob} />)}
            </section>
            <Pagination page={result.page} totalPages={result.totalPages} onPage={handlePage} />
          </>
        )}
      </main>

      <Footer />

      {selectedJob && <JobModal job={selectedJob} onClose={closeModal} />}
    </>
  );
}
