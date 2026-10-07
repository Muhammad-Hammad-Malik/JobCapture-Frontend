import CompanyAvatar from './CompanyAvatar.jsx';
import CompanyLine from './CompanyLine.jsx';
import { BriefcaseIcon, ChevronRightIcon, PinIcon } from '@/components/ui/Icons.jsx';
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
      <CompanyAvatar name={job.company} />

      <div className="job-main">
        <h3 className="job-title">{job.jobTitle}</h3>
        <p className="job-company"><CompanyLine job={job} /></p>

        <div className="job-meta">
          {job.stack && <span className="tag">{job.stack}</span>}
          {job.remoteType && <span className="tag" data-kind={job.remoteType}>{capitalize(job.remoteType)}</span>}
          {job.experienceYears != null && (
            <span className="job-meta-item"><BriefcaseIcon />{job.experienceYears}+ yrs</span>
          )}
          {job.location && <span className="job-meta-item"><PinIcon />{job.location}</span>}
        </div>

        {job.description && <p className="job-snippet">{job.description}</p>}
      </div>

      <div className="job-aside">
        <span className="job-time">{relativeTime(job.createdAt)}</span>
        <ChevronRightIcon className="job-chevron" />
      </div>
    </article>
  );
}
