import { CloseIcon } from '@/components/ui/Icons.jsx';
import { capitalize } from '@/utils/format';

export function getActiveChips(filters) {
  const chips = [];
  if (filters.search) chips.push({ key: 'search', label: `“${filters.search}”` });
  if (filters.stack) chips.push({ key: 'stack', label: filters.stack });
  if (filters.remoteType) chips.push({ key: 'remoteType', label: capitalize(filters.remoteType) });
  if (filters.minExperience !== '') chips.push({ key: 'minExperience', label: `${filters.minExperience}+ yrs min` });
  if (filters.maxExperience !== '') chips.push({ key: 'maxExperience', label: `${filters.maxExperience} yrs max` });
  return chips;
}

export default function ActiveFilters({ chips, onRemove }) {
  if (chips.length === 0) return null;
  return (
    <div className="active-filters">
      {chips.map(chip => (
        <span className="chip" key={chip.key}>
          {chip.label}
          <button aria-label={`Remove filter ${chip.label}`} onClick={() => onRemove(chip.key, '')}>
            <CloseIcon />
          </button>
        </span>
      ))}
    </div>
  );
}
