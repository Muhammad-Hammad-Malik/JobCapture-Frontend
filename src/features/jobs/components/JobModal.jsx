import { useEffect } from 'react';
import CompanyLine from './CompanyLine.jsx';
import { capitalize } from '@/utils/format';

export default function JobModal({ job, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const hasLinks = job.applicationLink || job.contactEmail || job.sourceUrl;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div className="modal-body">
          <h2 id="modal-title" className="modal-title">{job.jobTitle}</h2>
          <p className="modal-company">
            <CompanyLine job={job} />{job.location ? ` · ${job.location}` : ''}
          </p>
          <div className="modal-badges">
            <span className="badge">{job.stack}</span>
            {job.remoteType && <span className="badge badge-remote">{capitalize(job.remoteType)}</span>}
            {job.experienceYears != null && <span className="badge badge-exp">{job.experienceYears}+ yrs experience</span>}
          </div>
          <div className="modal-section">
            <h3>Description</h3>
            <p className="modal-description">{job.description || 'No description provided.'}</p>
          </div>
          {hasLinks && (
            <div className="modal-section">
              <h3>Get in touch</h3>
              <div className="modal-links">
                {job.applicationLink && (
                  <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">Apply</a>
                )}
                {job.contactEmail && (
                  <a className="link-secondary" href={`mailto:${job.contactEmail}`}>{job.contactEmail}</a>
                )}
                {job.sourceUrl && (
                  <a className="link-secondary" href={job.sourceUrl} target="_blank" rel="noopener noreferrer">View original post</a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
