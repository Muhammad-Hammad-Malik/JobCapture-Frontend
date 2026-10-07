import { useState } from 'react';
import DebouncedInput from '@/components/ui/DebouncedInput.jsx';
import { capitalize } from '@/utils/format';
import { STACK_OPTIONS } from '../constants';

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
  );
}

export default function FilterBar({ filters, onChange, onClear }) {
  const [open, setOpen] = useState(false);

  const chips = [];
  if (filters.search) chips.push({ key: 'search', label: `"${filters.search}"` });
  if (filters.stack) chips.push({ key: 'stack', label: filters.stack });
  if (filters.remoteType) chips.push({ key: 'remoteType', label: capitalize(filters.remoteType) });
  if (filters.minExperience !== '') chips.push({ key: 'minExperience', label: `${filters.minExperience}+ yrs min` });
  if (filters.maxExperience !== '') chips.push({ key: 'maxExperience', label: `${filters.maxExperience} yrs max` });

  return (
    <section className="filter-bar" aria-label="Search and filters">
      <div className="search-row">
        <div className="search-input-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <DebouncedInput
            id="search-input"
            type="search"
            placeholder="Search title, company, or description…"
            aria-label="Search jobs"
            value={filters.search}
            trim
            onCommit={v => onChange('search', v)}
          />
        </div>
        <button
          className="btn btn-outline filters-toggle"
          aria-expanded={open}
          aria-controls="filter-fields"
          onClick={() => setOpen(o => !o)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Filters
        </button>
      </div>

      <div id="filter-fields" className={`filter-fields${open ? ' open' : ''}`}>
        <div className="field">
          <label htmlFor="filter-stack">Stack</label>
          <select id="filter-stack" value={filters.stack} onChange={e => onChange('stack', e.target.value)}>
            <option value="">Any</option>
            {STACK_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-remote">Work type</label>
          <select id="filter-remote" value={filters.remoteType} onChange={e => onChange('remoteType', e.target.value)}>
            <option value="">Any</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>

        <div className="field field-range">
          <label>Experience (years)</label>
          <div className="range-inputs">
            <DebouncedInput
              type="number"
              min="0"
              placeholder="Min"
              aria-label="Minimum experience"
              value={filters.minExperience}
              onCommit={v => onChange('minExperience', v)}
            />
            <span className="range-sep">–</span>
            <DebouncedInput
              type="number"
              min="0"
              placeholder="Max"
              aria-label="Maximum experience"
              value={filters.maxExperience}
              onCommit={v => onChange('maxExperience', v)}
            />
          </div>
        </div>

        <button className="btn btn-text" onClick={onClear}>Clear all</button>
      </div>

      <div className="active-chips" aria-live="polite">
        {chips.map(chip => (
          <span className="chip" key={chip.key}>
            {chip.label}{' '}
            <button aria-label="Remove filter" onClick={() => onChange(chip.key, '')}><CloseIcon /></button>
          </span>
        ))}
      </div>
    </section>
  );
}
