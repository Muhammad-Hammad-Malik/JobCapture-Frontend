import CompanyLine from './CompanyLine.jsx';
import { capitalize, relativeTime } from '@/utils/format';

export default function JobCard({ job, onOpen }) {
  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(job);
    }
  };

  return (
    <article
      className="job-card"
      tabIndex={0}
      role="button"
      aria-label={`${job.jobTitle} at ${job.company}`}
      onClick={() => onOpen(job)}
      onKeyDown={handleKeyDown}
    >
      <div className="job-card-header">
        <h3 className="job-title">{job.jobTitle}</h3>
      </div>
      <p className="job-company"><CompanyLine job={job} /></p>
      <div className="badge-row">
        <span className="badge">{job.stack}</span>
        {job.remoteType && <span className="badge badge-remote">{capitalize(job.remoteType)}</span>}
        {job.experienceYears != null && <span className="badge badge-exp">{job.experienceYears}+ yrs</span>}
        {job.location && <span className="badge">{job.location}</span>}
      </div>
      <p className="job-snippet">{job.description || ''}</p>
      <div className="job-card-footer">
        <span>{relativeTime(job.createdAt)}</span>
      </div>
    </article>
  );
}
