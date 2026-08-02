const STACK_OPTIONS = [
  'Fullstack',
  'MERN',
  'MEAN',
  'Angular + .NET',
  '.NET',
  'Backend',
  'Frontend',
  'AI Engineer',
  'Software Engineer',
];

const state = {
  page: 1,
  limit: 12,
  search: '',
  stack: '',
  remoteType: '',
  minExperience: '',
  maxExperience: '',
};

let lastResult = null;

const els = {
  searchInput: document.getElementById('search-input'),
  toggleFilters: document.getElementById('toggle-filters'),
  filterFields: document.getElementById('filter-fields'),
  filterStack: document.getElementById('filter-stack'),
  filterRemote: document.getElementById('filter-remote'),
  filterMinExp: document.getElementById('filter-min-exp'),
  filterMaxExp: document.getElementById('filter-max-exp'),
  clearFilters: document.getElementById('clear-filters'),
  activeChips: document.getElementById('active-chips'),
  resultsCount: document.getElementById('results-count'),
  jobGrid: document.getElementById('job-grid'),
  pagination: document.getElementById('pagination'),
  stateLoading: document.getElementById('state-loading'),
  stateError: document.getElementById('state-error'),
  stateEmpty: document.getElementById('state-empty'),
  errorMessage: document.getElementById('error-message'),
  retryButton: document.getElementById('retry-button'),
  emptyClearButton: document.getElementById('empty-clear-button'),
  modalOverlay: document.getElementById('job-modal'),
  modalBody: document.getElementById('modal-body'),
  modalClose: document.getElementById('modal-close'),
};

function init() {
  STACK_OPTIONS.forEach(stack => {
    const opt = document.createElement('option');
    opt.value = stack;
    opt.textContent = stack;
    els.filterStack.appendChild(opt);
  });

  readStateFromUrl();
  syncFieldsFromState();

  els.searchInput.addEventListener('input', debounce(onSearchInput, 350));
  els.filterStack.addEventListener('change', () => updateFilter('stack', els.filterStack.value));
  els.filterRemote.addEventListener('change', () => updateFilter('remoteType', els.filterRemote.value));
  els.filterMinExp.addEventListener('input', debounce(() => updateFilter('minExperience', els.filterMinExp.value), 350));
  els.filterMaxExp.addEventListener('input', debounce(() => updateFilter('maxExperience', els.filterMaxExp.value), 350));
  els.clearFilters.addEventListener('click', clearAllFilters);
  els.emptyClearButton.addEventListener('click', clearAllFilters);
  els.retryButton.addEventListener('click', load);
  els.toggleFilters.addEventListener('click', toggleFiltersPanel);
  els.modalClose.addEventListener('click', closeModal);
  els.modalOverlay.addEventListener('click', e => {
    if (e.target === els.modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  load();
}

function toggleFiltersPanel() {
  const isOpen = els.filterFields.classList.toggle('open');
  els.toggleFilters.setAttribute('aria-expanded', String(isOpen));
}

function onSearchInput() {
  updateFilter('search', els.searchInput.value.trim());
}

function updateFilter(key, value) {
  state[key] = value;
  state.page = 1;
  writeStateToUrl();
  renderActiveChips();
  load();
}

function clearAllFilters() {
  state.search = '';
  state.stack = '';
  state.remoteType = '';
  state.minExperience = '';
  state.maxExperience = '';
  state.page = 1;
  syncFieldsFromState();
  writeStateToUrl();
  renderActiveChips();
  load();
}

function syncFieldsFromState() {
  els.searchInput.value = state.search;
  els.filterStack.value = state.stack;
  els.filterRemote.value = state.remoteType;
  els.filterMinExp.value = state.minExperience;
  els.filterMaxExp.value = state.maxExperience;
  renderActiveChips();
}

function readStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  state.search = params.get('search') || '';
  state.stack = params.get('stack') || '';
  state.remoteType = params.get('remoteType') || '';
  state.minExperience = params.get('minExperience') || '';
  state.maxExperience = params.get('maxExperience') || '';
  state.page = parseInt(params.get('page'), 10) || 1;
}

function writeStateToUrl() {
  const params = new URLSearchParams();
  if (state.search) params.set('search', state.search);
  if (state.stack) params.set('stack', state.stack);
  if (state.remoteType) params.set('remoteType', state.remoteType);
  if (state.minExperience !== '') params.set('minExperience', state.minExperience);
  if (state.maxExperience !== '') params.set('maxExperience', state.maxExperience);
  if (state.page > 1) params.set('page', state.page);
  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

function renderActiveChips() {
  const chips = [];
  if (state.search) chips.push({ key: 'search', label: `"${state.search}"` });
  if (state.stack) chips.push({ key: 'stack', label: state.stack });
  if (state.remoteType) chips.push({ key: 'remoteType', label: capitalize(state.remoteType) });
  if (state.minExperience !== '') chips.push({ key: 'minExperience', label: `${state.minExperience}+ yrs min` });
  if (state.maxExperience !== '') chips.push({ key: 'maxExperience', label: `${state.maxExperience} yrs max` });

  els.activeChips.innerHTML = '';
  chips.forEach(chip => {
    const el = document.createElement('span');
    el.className = 'chip';
    el.innerHTML = `${escapeHtml(chip.label)} <button aria-label="Remove filter" data-key="${chip.key}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></button>`;
    el.querySelector('button').addEventListener('click', () => removeChip(chip.key));
    els.activeChips.appendChild(el);
  });
}

function removeChip(key) {
  state[key] = '';
  state.page = 1;
  syncFieldsFromState();
  writeStateToUrl();
  load();
}

async function load() {
  showState('loading');
  try {
    const result = await Api.fetchJobs(state);
    lastResult = result;
    if (result.data.length === 0) {
      showState('empty');
      els.resultsCount.textContent = '';
      els.pagination.hidden = true;
      return;
    }
    renderGrid(result.data);
    renderResultsCount(result);
    renderPagination(result);
    showState('results');
  } catch (err) {
    els.errorMessage.textContent = err.message || 'Something went wrong.';
    showState('error');
  }
}

function showState(name) {
  els.stateLoading.hidden = name !== 'loading';
  els.stateError.hidden = name !== 'error';
  els.stateEmpty.hidden = name !== 'empty';
  els.jobGrid.hidden = name !== 'results';
  if (name !== 'results') {
    els.jobGrid.innerHTML = '';
    els.pagination.hidden = true;
  }
}

function renderResultsCount(result) {
  const start = (result.page - 1) * result.limit + 1;
  const end = Math.min(result.page * result.limit, result.total);
  els.resultsCount.textContent = `Showing ${start}-${end} of ${result.total} job${result.total === 1 ? '' : 's'}`;
}

function renderGrid(jobs) {
  els.jobGrid.innerHTML = '';
  jobs.forEach(job => els.jobGrid.appendChild(renderJobCard(job)));
}

function renderJobCard(job) {
  const card = document.createElement('article');
  card.className = 'job-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `${job.jobTitle} at ${job.company}`);

  const companyLine = job.isCompanyNameFallback
    ? `${escapeHtml(job.company)} <span class="fallback-note">(posted by — no company listed)</span>`
    : escapeHtml(job.company);

  card.innerHTML = `
    <div class="job-card-header">
      <h3 class="job-title">${escapeHtml(job.jobTitle)}</h3>
    </div>
    <p class="job-company">${companyLine}</p>
    <div class="badge-row">
      <span class="badge">${escapeHtml(job.stack)}</span>
      ${job.remoteType ? `<span class="badge badge-remote">${capitalize(job.remoteType)}</span>` : ''}
      ${job.experienceYears != null ? `<span class="badge badge-exp">${job.experienceYears}+ yrs</span>` : ''}
      ${job.location ? `<span class="badge">${escapeHtml(job.location)}</span>` : ''}
    </div>
    <p class="job-snippet">${escapeHtml(job.description || '')}</p>
    <div class="job-card-footer">
      <span>${relativeTime(job.createdAt)}</span>
    </div>
  `;

  const open = () => openModal(job);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });

  return card;
}

function renderPagination(result) {
  els.pagination.innerHTML = '';
  if (result.totalPages <= 1) {
    els.pagination.hidden = true;
    return;
  }
  els.pagination.hidden = false;

  const addButton = (label, page, opts = {}) => {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (opts.active ? ' active' : '');
    btn.textContent = label;
    btn.disabled = !!opts.disabled;
    if (!opts.disabled && !opts.active) {
      btn.addEventListener('click', () => goToPage(page));
    }
    els.pagination.appendChild(btn);
  };

  const addEllipsis = () => {
    const span = document.createElement('span');
    span.className = 'page-ellipsis';
    span.textContent = '…';
    els.pagination.appendChild(span);
  };

  addButton('‹', result.page - 1, { disabled: result.page === 1 });

  const pages = pageRange(result.page, result.totalPages);
  pages.forEach((p, i) => {
    if (p === null) {
      addEllipsis();
    } else {
      if (i > 0 && pages[i - 1] !== null && p - pages[i - 1] > 1) addEllipsis();
      addButton(String(p), p, { active: p === result.page });
    }
  });

  addButton('›', result.page + 1, { disabled: result.page === result.totalPages });
}

function pageRange(current, total) {
  const delta = 1;
  const range = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  return range;
}

function goToPage(page) {
  state.page = page;
  writeStateToUrl();
  load();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(job) {
  const companyLine = job.isCompanyNameFallback
    ? `${escapeHtml(job.company)} <span class="fallback-note">(posted by — no company listed)</span>`
    : escapeHtml(job.company);

  const links = [];
  if (job.applicationLink) {
    links.push(`<a href="${escapeAttr(job.applicationLink)}" target="_blank" rel="noopener noreferrer">Apply</a>`);
  }
  if (job.contactEmail) {
    links.push(`<a class="link-secondary" href="mailto:${escapeAttr(job.contactEmail)}">${escapeHtml(job.contactEmail)}</a>`);
  }
  if (job.sourceUrl) {
    links.push(`<a class="link-secondary" href="${escapeAttr(job.sourceUrl)}" target="_blank" rel="noopener noreferrer">View original post</a>`);
  }

  els.modalBody.innerHTML = `
    <h2 id="modal-title" class="modal-title">${escapeHtml(job.jobTitle)}</h2>
    <p class="modal-company">${companyLine}${job.location ? ` · ${escapeHtml(job.location)}` : ''}</p>
    <div class="modal-badges">
      <span class="badge">${escapeHtml(job.stack)}</span>
      ${job.remoteType ? `<span class="badge badge-remote">${capitalize(job.remoteType)}</span>` : ''}
      ${job.experienceYears != null ? `<span class="badge badge-exp">${job.experienceYears}+ yrs experience</span>` : ''}
    </div>
    <div class="modal-section">
      <h3>Description</h3>
      <p class="modal-description">${escapeHtml(job.description || 'No description provided.')}</p>
    </div>
    ${links.length ? `<div class="modal-section"><h3>Get in touch</h3><div class="modal-links">${links.join('')}</div></div>` : ''}
  `;

  els.modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  els.modalOverlay.hidden = true;
  document.body.style.overflow = '';
}

function relativeTime(isoDate) {
  if (!isoDate) return '';
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

init();
