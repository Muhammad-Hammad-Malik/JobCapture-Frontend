import CompanyAvatar from './CompanyAvatar.jsx';
import CompanyLine from './CompanyLine.jsx';
import JobTags from './JobTags.jsx';
import { BriefcaseIcon, ChevronRightIcon, PinIcon } from '@/components/ui/Icons.jsx';
import { capitalize, relativeTime } from '@/utils/format';
import { citiesLabel, experienceLabel } from '../utils/jobDisplay';

export default function JobCard({ job, onOpen }) {
  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(job);
    }
  };

  const experience = experienceLabel(job.experienceYears);
  const city = citiesLabel(job.cities);

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

        <JobTags items={job.categories} max={3} primary className="job-categories" />

        <div className="job-meta">
          {job.remoteType && <span className="tag" data-kind={job.remoteType}>{capitalize(job.remoteType)}</span>}
          {city && <span className="job-meta-item"><PinIcon />{city}</span>}
          <span className={`job-meta-item${experience ? '' : ' is-muted'}`}>
            <BriefcaseIcon />{experience || 'Experience not specified'}
          </span>
        </div>

        {job.description && <p className="job-snippet">{job.description}</p>}

        <JobTags items={job.skills} max={5} className="job-skills" />
      </div>

      <div className="job-aside">
        <span className="job-time">{relativeTime(job.createdAt)}</span>
        <ChevronRightIcon className="job-chevron" />
      </div>
    </article>
  );
}
