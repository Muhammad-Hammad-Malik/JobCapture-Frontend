import { useState } from 'react';
import DebouncedInput from '@/components/ui/DebouncedInput.jsx';
import { FilterIcon } from '@/components/ui/Icons.jsx';
import { STACK_OPTIONS } from '../constants';

// Sidebar on desktop, collapsible panel on small screens.
export default function FilterBar({ filters, activeCount, onChange, onClear }) {
  const [open, setOpen] = useState(false);

  return (
    <aside className={`filters${open ? ' open' : ''}`} aria-label="Filters">
      <div className="filters-header">
        <span className="filters-title">Filters{activeCount > 0 ? ` (${activeCount})` : ''}</span>
        <button
          className="btn btn-secondary filters-toggle"
          aria-expanded={open}
          aria-controls="filters-body"
          onClick={() => setOpen(o => !o)}
        >
          <FilterIcon />
          {open ? 'Hide' : 'Show'}
        </button>
        {activeCount > 0 && (
          <button className="btn btn-link filters-clear" onClick={onClear}>Clear all</button>
        )}
      </div>

      <div className="filters-body" id="filters-body">
        <div className="field">
          <label htmlFor="filter-stack">Stack</label>
          <select id="filter-stack" className="select" value={filters.stack} onChange={e => onChange('stack', e.target.value)}>
            <option value="">All stacks</option>
            {STACK_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-remote">Work type</label>
          <select id="filter-remote" className="select" value={filters.remoteType} onChange={e => onChange('remoteType', e.target.value)}>
            <option value="">Any</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>

        <div className="field">
          <span className="field-label" id="exp-label">Experience (years)</span>
          <div className="range" role="group" aria-labelledby="exp-label">
            <DebouncedInput
              className="input"
              type="number"
              min="0"
              placeholder="Min"
              aria-label="Minimum years of experience"
              value={filters.minExperience}
              onCommit={v => onChange('minExperience', v)}
            />
            <span className="range-sep" aria-hidden="true">–</span>
            <DebouncedInput
              className="input"
              type="number"
              min="0"
              placeholder="Max"
              aria-label="Maximum years of experience"
              value={filters.maxExperience}
              onCommit={v => onChange('maxExperience', v)}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
