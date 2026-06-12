const STORAGE_KEY = 'rosterLeaveTrackerState';
const WEEKS_IN_VIEW = 12;
const WEEKS_PER_PERIOD = 4;
const PERIODS_IN_VIEW = WEEKS_IN_VIEW / WEEKS_PER_PERIOD;
const CUSTOM_ROSTER_LINE_VALUE = '__custom_roster_line__';

let deferredInstallPrompt = null;

function formatLocalISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}-${month}-${year}`;
}

function getMondayISO(baseDate = new Date()) {
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  return formatLocalISO(d);
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return formatLocalISO(d);
}

function diffWeeks(startISO, endISO) {
  const start = new Date(startISO + 'T00:00:00');
  const end = new Date(endISO + 'T00:00:00');
  return Math.round((end - start) / (7 * 24 * 60 * 60 * 1000));
}

function createWeek(startDate, overrides = {}) {
  return {
    startDate,
    hoursWorked: '',
    daysWorked: '',
    weekendWorked: null,
    rosterLine: '',
    manualRosterText: '',
    collapsed: true,
    ...overrides,
    startDate
  };
}

function normalizeRosterLine(week = {}) {
  const nextWeek = { ...week };
  const rosterLine = typeof nextWeek.rosterLine === 'string' ? nextWeek.rosterLine.trim() : '';
  const manualRosterText = typeof nextWeek.manualRosterText === 'string' ? nextWeek.manualRosterText.trim() : '';

  if (!rosterLine || /^Roster\s\d+$/i.test(rosterLine) || rosterLine === 'Manual Entry') {
    nextWeek.rosterLine = manualRosterText || '';
    nextWeek.manualRosterText = '';
    return nextWeek;
  }

  nextWeek.rosterLine = rosterLine;
  nextWeek.manualRosterText = '';
  return nextWeek;
}

function normalizeWeek(week = {}) {
  return createWeek(week.startDate || getMondayISO(), {
    ...week,
    weekendWorked: week.weekendWorked === true ? true : week.weekendWorked === false ? false : null,
    collapsed: Boolean(week.collapsed),
    ...normalizeRosterLine(week)
  });
}

function getWeekMap(weeks = []) {
  return new Map(
    weeks
      .filter(week => week && week.startDate)
      .map(week => [week.startDate, normalizeWeek(week)])
  );
}

function buildWindowWeeks(windowStartDate, weekMap) {
  return Array.from({ length: WEEKS_IN_VIEW }, (_, index) => {
    const startDate = addDays(windowStartDate, index * 7);
    return weekMap.get(startDate) || createWeek(startDate);
  });
}

const initialMonday = getMondayISO();

const defaultState = {
  settings: {
    cycleStartDate: initialMonday,
    weeklyHoursBaseline: '43:00',
    daysBaselinePerPeriod: 17,
    settingsCollapsed: true
  },
  timeline: {
    windowStartDate: initialMonday,
    weeksByStart: {
      [initialMonday]: createWeek(initialMonday)
    }
  },
  leaveEntries: []
};

let state = applyCollapsedDefaults(loadState());

function applyCollapsedDefaults(nextState) {
  nextState.settings.settingsCollapsed = true;

  const weeksByStart = nextState.timeline?.weeksByStart || {};
  const weekMap = getWeekMap(Object.values(weeksByStart));
  weekMap.forEach((week, startDate) => {
    weekMap.set(startDate, normalizeWeek({ ...week, collapsed: true }));
  });

  nextState.timeline.weeksByStart = Object.fromEntries(
    [...weekMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  );

  return nextState;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return mergeState(parsed);
  } catch {
    return structuredClone(defaultState);
  }
}

function mergeState(parsed) {
  const merged = structuredClone(defaultState);

  if (parsed.settings) {
    merged.settings.cycleStartDate = parsed.settings.cycleStartDate
      || parsed.timeline?.windowStartDate
      || merged.settings.cycleStartDate;
    merged.settings.weeklyHoursBaseline = parsed.settings.weeklyHoursBaseline || merged.settings.weeklyHoursBaseline;
    merged.settings.daysBaselinePerPeriod = Number.isFinite(parsed.settings.daysBaselinePerPeriod)
      ? parsed.settings.daysBaselinePerPeriod
      : Number(parsed.settings.daysBaselinePerPeriod) || merged.settings.daysBaselinePerPeriod;
    merged.settings.settingsCollapsed = Object.prototype.hasOwnProperty.call(parsed.settings, 'settingsCollapsed')
      ? Boolean(parsed.settings.settingsCollapsed)
      : true;
  }

  const legacyWeeks = Array.isArray(parsed.cycle?.weeks) ? parsed.cycle.weeks : [];
  const priorTimelineWeeks = Array.isArray(parsed.timeline?.weeks) ? parsed.timeline.weeks : [];
  const weeksByStartEntries = parsed.timeline?.weeksByStart && typeof parsed.timeline.weeksByStart === 'object'
    ? Object.values(parsed.timeline.weeksByStart)
    : [];

  const combinedWeeks = [...legacyWeeks, ...priorTimelineWeeks, ...weeksByStartEntries].filter(Boolean);
  const weekMap = getWeekMap(combinedWeeks);

  const fallbackWindowStart = parsed.timeline?.windowStartDate
    || parsed.timeline?.anchorDate
    || parsed.timeline?.currentWeekStartDate
    || parsed.cycle?.startDate
    || initialMonday;

  for (let i = 0; i < WEEKS_IN_VIEW; i++) {
    const startDate = addDays(fallbackWindowStart, i * 7);
    if (!weekMap.has(startDate)) {
      weekMap.set(startDate, createWeek(startDate));
    }
  }

  merged.timeline.windowStartDate = fallbackWindowStart;
  merged.timeline.weeksByStart = Object.fromEntries([...weekMap.entries()]);

  if (Array.isArray(parsed.leaveEntries)) merged.leaveEntries = parsed.leaveEntries;
  return merged;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getWeeksMap() {
  return getWeekMap(Object.values(state.timeline.weeksByStart || {}));
}

function setWeeksMap(weekMap) {
  state.timeline.weeksByStart = Object.fromEntries([...weekMap.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

function ensureWindowWeeks(windowStartDate = state.timeline.windowStartDate) {
  const weekMap = getWeeksMap();

  for (let i = 0; i < WEEKS_IN_VIEW; i++) {
    const startDate = addDays(windowStartDate, i * 7);
    if (!weekMap.has(startDate)) {
      weekMap.set(startDate, createWeek(startDate));
    }
  }

  setWeeksMap(weekMap);
}

function parseHoursToMinutes(value) {
  if (!value || !/^\d{1,3}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(':').map(Number);
  if (minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function minutesToHourString(totalMinutes) {
  const sign = totalMinutes < 0 ? '-' : '';
  const abs = Math.abs(Math.round(totalMinutes));
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return `${sign}${hours}:${String(minutes).padStart(2, '0')}`;
}

function minutesToVarianceLabel(minutes) {
  if (minutes > 0) return `Over by ${minutesToHourString(minutes)}`;
  if (minutes < 0) return `Under by ${minutesToHourString(Math.abs(minutes))}`;
  return 'On target';
}

function statusClass(isOver) {
  return isOver ? 'status-over' : 'status-ok';
}

function getVisibleWeeks() {
  ensureWindowWeeks(state.timeline.windowStartDate);
  const weekMap = getWeeksMap();
  return buildWindowWeeks(state.timeline.windowStartDate, weekMap).map((week, index) => ({
    ...week,
    absoluteIndex: index,
    period: Math.floor(index / WEEKS_PER_PERIOD) + 1,
    displayNumber: index + 1
  }));
}

function getRecordedWeeks(weeks) {
  return weeks.filter(w => parseHoursToMinutes(w.hoursWorked) !== null);
}

function getPeriodWeeks(weeks, periodIndex) {
  const start = periodIndex * WEEKS_PER_PERIOD;
  return weeks.slice(start, start + WEEKS_PER_PERIOD);
}

function computePeriodSummary(visibleWeeks, periodIndex) {
  const weeks = getPeriodWeeks(visibleWeeks, periodIndex);
  const recordedWeeks = weeks.filter(w => parseHoursToMinutes(w.hoursWorked) !== null);
  const totalMinutes = recordedWeeks.reduce((sum, w) => sum + parseHoursToMinutes(w.hoursWorked), 0);
  const totalDays = weeks.reduce((sum, w) => sum + (Number(w.daysWorked) || 0), 0);
  const weekendsWorked = weeks.filter(w => w.weekendWorked === true).length;
  const baselineMinutes = parseHoursToMinutes(state.settings.weeklyHoursBaseline) || 0;
  const averageMinutes = recordedWeeks.length ? totalMinutes / recordedWeeks.length : 0;
  const varianceMinutes = averageMinutes - baselineMinutes;
  const completeForDays = weeks.length === WEEKS_PER_PERIOD && weeks.every(w => Number(w.daysWorked) >= 0 && String(w.daysWorked) !== '');
  const daysVariance = completeForDays ? totalDays - Number(state.settings.daysBaselinePerPeriod || 0) : null;

  return {
    recordedWeeks: recordedWeeks.length,
    totalMinutes,
    totalDays,
    weekendsWorked,
    averageMinutes,
    varianceMinutes,
    completeForDays,
    daysVariance
  };
}

function computeTimelineSummary(visibleWeeks) {
  const recordedWeeks = getRecordedWeeks(visibleWeeks);
  const totalMinutes = recordedWeeks.reduce((sum, w) => sum + parseHoursToMinutes(w.hoursWorked), 0);
  const baselineMinutes = parseHoursToMinutes(state.settings.weeklyHoursBaseline) || 0;
  const averageMinutes = recordedWeeks.length ? totalMinutes / recordedWeeks.length : 0;
  const varianceMinutes = averageMinutes - baselineMinutes;
  const weekendsWorked = visibleWeeks.filter(w => w.weekendWorked === true).length;

  return {
    recordedWeeks: recordedWeeks.length,
    totalMinutes,
    averageMinutes,
    varianceMinutes,
    weekendsWorked,
    baselineMinutesForRecordedWeeks: baselineMinutes * recordedWeeks.length
  };
}

function getRosterLineOptions() {
  const rosterLines = new Set();

  Object.values(state.timeline.weeksByStart || {}).forEach(week => {
    const rosterLine = typeof week?.rosterLine === 'string' ? week.rosterLine.trim() : '';
    if (rosterLine && rosterLine !== CUSTOM_ROSTER_LINE_VALUE) {
      rosterLines.add(rosterLine);
    }
  });

  return [...rosterLines].sort((left, right) => left.localeCompare(right));
}

function inclusiveDaysBetween(start, end) {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const diff = Math.round((e - s) / 86400000);
  return diff >= 0 ? diff + 1 : 0;
}

function navigateWindow(offsetWeeks) {
  state.timeline.windowStartDate = addDays(state.timeline.windowStartDate, offsetWeeks * 7);
  ensureWindowWeeks(state.timeline.windowStartDate);
  render();
}

function getCurrentCycleStartDate() {
  const anchorStart = state.settings.cycleStartDate || state.timeline.windowStartDate || getMondayISO(new Date());
  const todayISO = formatLocalISO(new Date());
  const weekOffsetFromAnchor = diffWeeks(anchorStart, todayISO);
  const cyclesFromAnchor = Math.floor(weekOffsetFromAnchor / WEEKS_IN_VIEW);
  return addDays(anchorStart, cyclesFromAnchor * WEEKS_IN_VIEW * 7);
}

function commitWeekField(startDate, field, value) {
  const weekMap = getWeeksMap();
  const week = weekMap.get(startDate) || createWeek(startDate);
  week[field] = value;
  weekMap.set(startDate, normalizeWeek(week));
  setWeeksMap(weekMap);
}

async function refreshAppAssets() {
  const button = document.getElementById('devRefreshButton');
  if (button) {
    button.disabled = true;
    button.textContent = 'Refreshing…';
  }

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    }

    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map(key => caches.delete(key)));
    }
  } catch (error) {
    console.error('Failed to refresh app assets', error);
  } finally {
    window.location.reload();
  }
}

function exportStateAsJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    state
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const fileDate = formatLocalISO(new Date());

  const link = document.createElement('a');
  link.href = url;
  link.download = `roster-tracker-backup-${fileDate}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function updateInstallButton() {
  const installButton = document.getElementById('installAppButton');
  if (!installButton) return;

  const shouldShow = Boolean(deferredInstallPrompt) && !isAppInstalled();
  installButton.classList.toggle('hidden', !shouldShow);
}

async function promptInstallApp() {
  if (!deferredInstallPrompt) return;

  deferredInstallPrompt.prompt();
  try {
    await deferredInstallPrompt.userChoice;
  } finally {
    deferredInstallPrompt = null;
    updateInstallButton();
  }
}

function importStateFromJsonFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const raw = String(reader.result || '');
      const parsed = JSON.parse(raw);
      const candidateState = parsed && typeof parsed === 'object' && parsed.state ? parsed.state : parsed;
      const nextState = applyCollapsedDefaults(mergeState(candidateState));
      state = nextState;
      render();
      window.alert('Import complete.');
    } catch {
      window.alert('Import failed. Please select a valid JSON export file.');
    }
  };
  reader.onerror = () => {
    window.alert('Import failed. Could not read the selected file.');
  };
  reader.readAsText(file);
}

function render() {
  ensureWindowWeeks(state.timeline.windowStartDate);
  renderSettings();
  renderWeeks();
  renderPeriodSummaries();
  renderCycleSummary();
  renderLeaveSection();
  saveState();
}

function renderSettings() {
  const settingsBody = document.getElementById('settingsBody');
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsCollapseIndicator = document.getElementById('settingsCollapseIndicator');

  settingsBody?.classList.toggle('hidden', state.settings.settingsCollapsed);
  settingsToggle?.setAttribute('aria-expanded', String(!state.settings.settingsCollapsed));
  if (settingsCollapseIndicator) {
    settingsCollapseIndicator.textContent = state.settings.settingsCollapsed ? '[+]' : '[-]';
  }

  document.getElementById('cycleStartDate').value = state.settings.cycleStartDate;
  document.getElementById('weeklyHoursBaseline').value = state.settings.weeklyHoursBaseline;
  document.getElementById('daysBaselinePerPeriod').value = state.settings.daysBaselinePerPeriod;
}

function renderWeeks() {
  const container = document.getElementById('weeksContainer');
  container.innerHTML = '';

  const visibleWeeks = getVisibleWeeks();
  const rosterLineOptions = getRosterLineOptions();

  const toolbar = document.createElement('div');
  toolbar.className = 'weeks-toolbar';
  toolbar.innerHTML = `
    <button type="button" class="weeks-nav-button" data-action="prevWindow">Previous 12 Weeks</button>
    <button type="button" class="weeks-nav-button weeks-nav-current" data-action="currentWindow">Current 12 Weeks</button>
    <button type="button" class="weeks-nav-button" data-action="nextWindow">Next 12 Weeks</button>
  `;
  container.appendChild(toolbar);

  visibleWeeks.forEach((week) => {
    const summaryHours = week.hoursWorked || '—';
    const summaryDays = week.daysWorked !== '' ? week.daysWorked : '—';
    const summaryWeekend = week.weekendWorked === true ? 'Worked' : week.weekendWorked === false ? 'Not worked' : 'Not set';
    const summaryStartDate = formatDisplayDate(week.startDate);
    const rosterLineValue = week.rosterLine || CUSTOM_ROSTER_LINE_VALUE;
    const weekRosterLines = rosterLineOptions.includes(week.rosterLine) ? rosterLineOptions : [...rosterLineOptions, week.rosterLine].filter(Boolean).sort((left, right) => left.localeCompare(right));

    const card = document.createElement('div');
    card.className = `week-card period-${week.period} ${week.collapsed ? 'collapsed' : ''}`;
    card.innerHTML = `
      <button type="button" class="week-toggle" data-action="toggleWeek" data-start-date="${week.startDate}">
        <span class="week-title">Week ${week.displayNumber} · Period ${week.period}</span>
        <span class="collapse-indicator" aria-hidden="true">${week.collapsed ? '[+]' : '[-]'}</span>
        <span class="week-summary">${summaryStartDate} · ${summaryHours} hrs · ${summaryDays} days · Weekend: ${summaryWeekend}</span>
      </button>
      <div class="week-body ${week.collapsed ? 'hidden' : ''}">
        <div class="field">
          <label>Week Start Date</label>
          <input type="text" value="${summaryStartDate}" disabled />
        </div>
        <div class="field">
          <label>Hours Worked ([h]:mm)</label>
          <input type="text" placeholder="43:00" value="${week.hoursWorked}" data-field="hoursWorked" data-start-date="${week.startDate}" />
        </div>
        <div class="field">
          <label>Days Worked</label>
          <input type="number" min="0" step="1" value="${week.daysWorked}" data-field="daysWorked" data-start-date="${week.startDate}" />
        </div>
        <div class="field">
          <label>Roster Line</label>
          <select data-field="rosterLine" data-start-date="${week.startDate}">
            <option value="${CUSTOM_ROSTER_LINE_VALUE}" ${rosterLineValue === CUSTOM_ROSTER_LINE_VALUE ? 'selected' : ''}>Custom / New...</option>
            ${weekRosterLines.map(line => `<option value="${line}" ${week.rosterLine === line ? 'selected' : ''}>${line}</option>`).join('')}
          </select>
        </div>
        <div class="field ${week.rosterLine ? 'hidden' : ''}">
          <label>Roster Line Name</label>
          <input type="text" placeholder="Enter roster line" value="${week.manualRosterText || ''}" data-field="manualRosterText" data-start-date="${week.startDate}" />
        </div>
        <div class="field">
          <label>Weekend Worked</label>
          <select data-field="weekendWorked" data-start-date="${week.startDate}">
            <option value="" ${week.weekendWorked === null ? 'selected' : ''}>Not set</option>
            <option value="true" ${week.weekendWorked === true ? 'selected' : ''}>Worked</option>
            <option value="false" ${week.weekendWorked === false ? 'selected' : ''}>Not worked</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelector('[data-action="prevWindow"]')?.addEventListener('click', () => navigateWindow(-WEEKS_IN_VIEW));
  container.querySelector('[data-action="currentWindow"]')?.addEventListener('click', () => {
    state.timeline.windowStartDate = getCurrentCycleStartDate();
    ensureWindowWeeks(state.timeline.windowStartDate);
    render();
  });
  container.querySelector('[data-action="nextWindow"]')?.addEventListener('click', () => navigateWindow(WEEKS_IN_VIEW));

  container.querySelectorAll('[data-action="toggleWeek"]').forEach(el => {
    el.addEventListener('click', handleWeekToggle);
  });

  container.querySelectorAll('input[data-field], select[data-field]').forEach(el => {
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', handleWeekChange);
    } else {
      el.addEventListener('blur', handleWeekBlur);
    }
  });
}

function handleWeekToggle(event) {
  const startDate = event.currentTarget.dataset.startDate;
  const weekMap = getWeeksMap();
  const week = weekMap.get(startDate) || createWeek(startDate);
  week.collapsed = !week.collapsed;
  weekMap.set(startDate, week);
  setWeeksMap(weekMap);
  render();
}

function handleSettingsToggle() {
  state.settings.settingsCollapsed = !state.settings.settingsCollapsed;
  render();
}

function handleWeekBlur(event) {
  const startDate = event.target.dataset.startDate;
  const field = event.target.dataset.field;
  const value = event.target.value;

  if (field === 'manualRosterText') {
    const rosterLine = value.trim();
    commitWeekField(startDate, 'rosterLine', rosterLine);
    commitWeekField(startDate, 'manualRosterText', '');
    render();
    return;
  }

  commitWeekField(startDate, field, value);
  render();
}

function handleWeekChange(event) {
  const startDate = event.target.dataset.startDate;
  const field = event.target.dataset.field;
  let value = event.target.value;

  if (field === 'weekendWorked') {
    value = value === 'true' ? true : value === 'false' ? false : null;
  } else if (field === 'rosterLine' && value === CUSTOM_ROSTER_LINE_VALUE) {
    value = '';
  }

  commitWeekField(startDate, field, value);
  render();
}

function renderPeriodSummaries() {
  const container = document.getElementById('periodSummaries');
  container.innerHTML = '';
  const visibleWeeks = getVisibleWeeks();

  for (let i = 0; i < PERIODS_IN_VIEW; i++) {
    const s = computePeriodSummary(visibleWeeks, i);
    const overHours = s.varianceMinutes > 0;
    const period = document.createElement('div');
    period.className = 'period-summary';
    period.innerHTML = `
      <h3>Period ${i + 1}</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">Recorded Weeks</span>
          <strong>${s.recordedWeeks} / ${WEEKS_PER_PERIOD}</strong>
        </div>
        <div class="summary-item">
          <span class="label">Total Hours</span>
          <strong>${minutesToHourString(s.totalMinutes)}</strong>
        </div>
        <div class="summary-item">
          <span class="label">Average Weekly Hours</span>
          <strong>${s.recordedWeeks ? minutesToHourString(s.averageMinutes) : '0:00'}</strong>
        </div>
        <div class="summary-item">
          <span class="label">Hours Status</span>
          <strong class="${statusClass(overHours)}">${s.recordedWeeks ? minutesToVarianceLabel(s.varianceMinutes) : 'Awaiting data'}</strong>
        </div>
        <div class="summary-item">
          <span class="label">Days Worked</span>
          <strong>${s.totalDays}</strong>
        </div>
        <div class="summary-item">
          <span class="label">Days Status</span>
          <strong class="${s.daysVariance !== null ? statusClass(s.daysVariance > 0) : ''}">
            ${s.daysVariance === null ? 'Awaiting 4 weeks of data' : s.daysVariance > 0 ? `Over by ${s.daysVariance} day(s)` : s.daysVariance < 0 ? `Under by ${Math.abs(s.daysVariance)} day(s)` : 'On target'}
          </strong>
        </div>
        <div class="summary-item">
          <span class="label">Weekends Worked</span>
          <strong>${s.weekendsWorked}</strong>
        </div>
      </div>
    `;
    container.appendChild(period);
  }
}

function renderCycleSummary() {
  const visibleWeeks = getVisibleWeeks();
  const s = computeTimelineSummary(visibleWeeks);
  const cycleStartDate = state.timeline.windowStartDate;
  const cycleEndDate = addDays(cycleStartDate, (WEEKS_IN_VIEW * 7) - 1);
  const todayISO = formatLocalISO(new Date());
  const cycleStatus = todayISO < cycleStartDate
    ? 'Future'
    : todayISO > cycleEndDate
      ? 'Archived'
      : 'Current';
  const averageHoursOver = s.varianceMinutes > 0;
  const totalHoursVarianceMinutes = s.totalMinutes - s.baselineMinutesForRecordedWeeks;
  const totalHoursVarianceText = s.recordedWeeks ? minutesToVarianceLabel(totalHoursVarianceMinutes) : 'Awaiting data';
  const weekendsOver = s.weekendsWorked > 6;
  const periodAverageDaysMarkup = Array.from({ length: PERIODS_IN_VIEW }, (_, index) => {
    const periodSummary = computePeriodSummary(visibleWeeks, index);
    const content = periodSummary.completeForDays
      ? `${periodSummary.totalDays}`
      : 'N/A';
    const className = periodSummary.daysVariance !== null
      ? statusClass(periodSummary.daysVariance > 0)
      : '';

    return `<span class="${className}">${content}</span>`;
  }).join(' <span class="metric-separator">|</span> ');

  document.getElementById('cycleMeta').textContent = `${formatDisplayDate(cycleStartDate)} to ${formatDisplayDate(cycleEndDate)} | ${cycleStatus} Cycle`;
  document.getElementById('weeksRecorded').textContent = `${s.recordedWeeks} / ${WEEKS_IN_VIEW}`;
  document.getElementById('totalActualHours').textContent = minutesToHourString(s.totalMinutes);
  const avgWeeklyHoursEl = document.getElementById('avgWeeklyHours');
  avgWeeklyHoursEl.textContent = s.recordedWeeks ? minutesToHourString(s.averageMinutes) : '0:00';
  avgWeeklyHoursEl.className = s.recordedWeeks ? statusClass(averageHoursOver) : '';
  const totalHoursVarianceEl = document.getElementById('totalHoursVariance');
  totalHoursVarianceEl.textContent = totalHoursVarianceText;
  totalHoursVarianceEl.className = s.recordedWeeks ? statusClass(totalHoursVarianceMinutes > 0) : '';
  document.getElementById('periodAverageDays').innerHTML = periodAverageDaysMarkup;

  const weekendsEl = document.getElementById('weekendsWorked');
  weekendsEl.textContent = `${s.weekendsWorked} / 6`;
  weekendsEl.className = statusClass(weekendsOver);
}

function renderLeaveSection() {
  const currentYear = Number(document.getElementById('leaveYearFilter').value) || new Date().getFullYear();
  document.getElementById('leaveYearFilter').value = currentYear;

  const filtered = state.leaveEntries.filter(entry => {
    return new Date(entry.startDate + 'T00:00:00').getFullYear() === currentYear;
  });

  const leaveDaysTotal = filtered.reduce((sum, entry) => sum + (entry.totalDays || 0), 0);
  const missingCertificates = filtered.filter(entry => !entry.medicalCertificate).length;

  document.getElementById('leaveDaysTotal').textContent = leaveDaysTotal;
  document.getElementById('missingCertificates').textContent = missingCertificates;

  const list = document.getElementById('leaveList');
  list.innerHTML = filtered.length
    ? filtered.map(entry => `
        <div class="leave-item">
          <button type="button" class="leave-delete-button" data-action="deleteLeave" data-leave-id="${entry.id}">Delete</button>
          <strong>${formatDisplayDate(entry.startDate)} to ${formatDisplayDate(entry.endDate)}</strong>
          <div>${entry.totalDays} day(s)</div>
          <div>${entry.medicalCertificate ? 'Medical certificate provided' : 'No medical certificate'}</div>
        </div>
      `).join('')
    : '<p class="subtle">No leave records for this year.</p>';
}

document.getElementById('cycleStartDate').addEventListener('change', e => {
  state.settings.cycleStartDate = e.target.value;
  state.timeline.windowStartDate = e.target.value;
  ensureWindowWeeks(state.timeline.windowStartDate);
  render();
});

document.getElementById('weeklyHoursBaseline').addEventListener('input', e => {
  state.settings.weeklyHoursBaseline = e.target.value;
  render();
});

document.getElementById('daysBaselinePerPeriod').addEventListener('input', e => {
  state.settings.daysBaselinePerPeriod = Number(e.target.value) || 0;
  render();
});

document.getElementById('settingsToggle')?.addEventListener('click', handleSettingsToggle);
document.getElementById('exportJsonButton')?.addEventListener('click', exportStateAsJson);
document.getElementById('importJsonButton')?.addEventListener('click', () => {
  document.getElementById('importJsonInput')?.click();
});
document.getElementById('installAppButton')?.addEventListener('click', promptInstallApp);
document.getElementById('importJsonInput')?.addEventListener('change', event => {
  const file = event.target.files && event.target.files[0];
  const confirmed = window.confirm('Importing will replace current saved data. Continue?');
  if (!confirmed) {
    event.target.value = '';
    return;
  }

  importStateFromJsonFile(file);
  event.target.value = '';
});

document.getElementById('leaveYearFilter').addEventListener('input', renderLeaveSection);
document.getElementById('devRefreshButton')?.addEventListener('click', () => {
  const confirmed = window.confirm('Refresh app assets now? This will clear cached files and reload the app.');
  if (!confirmed) return;
  refreshAppAssets();
});
document.getElementById('leaveList').addEventListener('click', event => {
  const deleteButton = event.target.closest('[data-action="deleteLeave"]');
  if (!deleteButton) return;

  const leaveId = deleteButton.dataset.leaveId;
  if (!leaveId) return;

  const confirmed = window.confirm('Delete this leave entry?');
  if (!confirmed) return;

  state.leaveEntries = state.leaveEntries.filter(entry => entry.id !== leaveId);
  render();
});

document.getElementById('leaveForm').addEventListener('submit', e => {
  e.preventDefault();
  const startDate = document.getElementById('leaveStart').value;
  const endDate = document.getElementById('leaveEnd').value;
  const medicalCertificate = document.getElementById('leaveMedical').checked;
  if (!startDate || !endDate) return;
  const totalDays = inclusiveDaysBetween(startDate, endDate);
  if (!totalDays) return;

  state.leaveEntries.unshift({
    id: `leave-${Date.now()}`,
    startDate,
    endDate,
    totalDays,
    medicalCertificate
  });

  e.target.reset();
  render();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  updateInstallButton();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  updateInstallButton();
});

render();
updateInstallButton();
