const STORAGE_KEY = 'rosterLeaveTrackerState';

function formatLocalISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMondayISO(baseDate = new Date()) {
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  return formatLocalISO(d);
}

const initialMonday = getMondayISO();

const defaultState = {
  settings: {
    weeklyHoursBaseline: '43:00',
    daysBaselinePerPeriod: 16
  },
  cycle: {
    startDate: initialMonday,
    weeks: Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      startDate: addDays(initialMonday, index * 7),
      hoursWorked: '',
      daysWorked: '',
      weekendWorked: null,
      rosterLine: 'Roster 1',
      manualRosterText: '',
      collapsed: true
    }))
  },
  leaveEntries: []
};

let state = loadState();

function todayISO() {
  return formatLocalISO(new Date());
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return formatLocalISO(d);
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
    merged.settings.weeklyHoursBaseline = parsed.settings.weeklyHoursBaseline || merged.settings.weeklyHoursBaseline;
    merged.settings.daysBaselinePerPeriod = Number.isFinite(parsed.settings.daysBaselinePerPeriod)
      ? parsed.settings.daysBaselinePerPeriod
      : Number(parsed.settings.daysBaselinePerPeriod) || merged.settings.daysBaselinePerPeriod;
  }
  if (parsed.cycle?.startDate) merged.cycle.startDate = parsed.cycle.startDate;
  if (Array.isArray(parsed.cycle?.weeks)) {
    merged.cycle.weeks = merged.cycle.weeks.map((week, i) => ({
      ...week,
      weekendWorked: null,
      collapsed: true,
      ...(parsed.cycle.weeks[i] || {})
    }));
  }
  if (Array.isArray(parsed.leaveEntries)) merged.leaveEntries = parsed.leaveEntries;
  return merged;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

function getRecordedWeeks() {
  return state.cycle.weeks.filter(w => parseHoursToMinutes(w.hoursWorked) !== null);
}

function getPeriodWeeks(periodIndex) {
  const start = periodIndex * 4;
  return state.cycle.weeks.slice(start, start + 4);
}

function computePeriodSummary(periodIndex) {
  const weeks = getPeriodWeeks(periodIndex);
  const recordedWeeks = weeks.filter(w => parseHoursToMinutes(w.hoursWorked) !== null);
  const totalMinutes = recordedWeeks.reduce((sum, w) => sum + parseHoursToMinutes(w.hoursWorked), 0);
  const totalDays = weeks.reduce((sum, w) => sum + (Number(w.daysWorked) || 0), 0);
  const weekendsWorked = weeks.filter(w => w.weekendWorked === true).length;
  const baselineMinutes = parseHoursToMinutes(state.settings.weeklyHoursBaseline) || 0;
  const averageMinutes = recordedWeeks.length ? totalMinutes / recordedWeeks.length : 0;
  const varianceMinutes = averageMinutes - baselineMinutes;
  const completeForDays = weeks.every(w => Number(w.daysWorked) >= 0 && String(w.daysWorked) !== '');
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

function computeCycleSummary() {
  const recordedWeeks = getRecordedWeeks();
  const totalMinutes = recordedWeeks.reduce((sum, w) => sum + parseHoursToMinutes(w.hoursWorked), 0);
  const baselineMinutes = parseHoursToMinutes(state.settings.weeklyHoursBaseline) || 0;
  const averageMinutes = recordedWeeks.length ? totalMinutes / recordedWeeks.length : 0;
  const varianceMinutes = averageMinutes - baselineMinutes;
  const weekendsWorked = state.cycle.weeks.filter(w => w.weekendWorked === true).length;

  return {
    recordedWeeks: recordedWeeks.length,
    totalMinutes,
    averageMinutes,
    varianceMinutes,
    weekendsWorked,
    baseHours12Weeks: baselineMinutes * 12
  };
}

function inclusiveDaysBetween(start, end) {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const diff = Math.round((e - s) / 86400000);
  return diff >= 0 ? diff + 1 : 0;
}

function render() {
  renderSettings();
  renderWeeks();
  renderPeriodSummaries();
  renderCycleSummary();
  renderLeaveSection();
  saveState();
}

function renderSettings() {
  document.getElementById('cycleStartDate').value = state.cycle.startDate;
  document.getElementById('weeklyHoursBaseline').value = state.settings.weeklyHoursBaseline;
  document.getElementById('daysBaselinePerPeriod').value = state.settings.daysBaselinePerPeriod;
  document.getElementById('baseHours12Weeks').textContent =
    minutesToHourString((parseHoursToMinutes(state.settings.weeklyHoursBaseline) || 0) * 12);
}

function renderWeeks() {
  const container = document.getElementById('weeksContainer');
  container.innerHTML = '';

  state.cycle.weeks.forEach((week, index) => {
    const period = Math.floor(index / 4) + 1;
    const summaryHours = week.hoursWorked || '—';
    const summaryDays = week.daysWorked !== '' ? week.daysWorked : '—';
    const summaryWeekend = week.weekendWorked === true ? 'Worked' : week.weekendWorked === false ? 'Not worked' : 'Not set';

    const card = document.createElement('div');
    card.className = `week-card period-${period} ${week.collapsed ? 'collapsed' : ''}`;
    card.innerHTML = `
      <button type="button" class="week-toggle" data-action="toggleWeek" data-week="${index}">
        <span class="week-title">Week ${week.id} · Period ${period}</span>
        <span class="week-summary">${week.startDate} · ${summaryHours} hrs · ${summaryDays} days · Weekend: ${summaryWeekend}</span>
      </button>
      <div class="week-body ${week.collapsed ? 'hidden' : ''}">
        <div class="field">
          <label>Week Start Date</label>
          <input type="date" value="${week.startDate}" data-field="startDate" data-week="${index}" />
        </div>
        <div class="field">
          <label>Hours Worked ([h]:mm)</label>
          <input type="text" placeholder="43:00" value="${week.hoursWorked}" data-field="hoursWorked" data-week="${index}" />
        </div>
        <div class="field">
          <label>Days Worked</label>
          <input type="number" min="0" step="1" value="${week.daysWorked}" data-field="daysWorked" data-week="${index}" />
        </div>
        <div class="field">
          <label>Roster Line</label>
          <select data-field="rosterLine" data-week="${index}">
            <option ${week.rosterLine === 'Roster 1' ? 'selected' : ''}>Roster 1</option>
            <option ${week.rosterLine === 'Roster 2' ? 'selected' : ''}>Roster 2</option>
            <option ${week.rosterLine === 'Roster 3' ? 'selected' : ''}>Roster 3</option>
            <option ${week.rosterLine === 'Manual Entry' ? 'selected' : ''}>Manual Entry</option>
          </select>
        </div>
        <div class="field ${week.rosterLine === 'Manual Entry' ? '' : 'hidden'}">
          <label>Manual Roster Text</label>
          <input type="text" value="${week.manualRosterText || ''}" data-field="manualRosterText" data-week="${index}" />
        </div>
        <div class="field">
          <label>Weekend Worked</label>
          <select data-field="weekendWorked" data-week="${index}">
            <option value="" ${week.weekendWorked === null ? 'selected' : ''}>Not set</option>
            <option value="true" ${week.weekendWorked === true ? 'selected' : ''}>Worked</option>
            <option value="false" ${week.weekendWorked === false ? 'selected' : ''}>Not worked</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('[data-action="toggleWeek"]').forEach(el => {
    el.addEventListener('click', handleWeekToggle);
  });

  container.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', handleWeekInput);
    el.addEventListener('change', handleWeekInput);
  });
}

function handleWeekToggle(event) {
  const index = Number(event.currentTarget.dataset.week);
  state.cycle.weeks[index].collapsed = !state.cycle.weeks[index].collapsed;
  render();
}

function handleWeekInput(event) {
  const index = Number(event.target.dataset.week);
  const field = event.target.dataset.field;
  let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

  if (field === 'weekendWorked') {
    value = value === 'true' ? true : value === 'false' ? false : null;
  }

  if (field === 'startDate' && index === 0) {
    state.cycle.startDate = value;
    state.cycle.weeks.forEach((week, weekIndex) => {
      week.startDate = addDays(value, weekIndex * 7);
    });
    render();
    return;
  }

  state.cycle.weeks[index][field] = value;
  render();
}

function renderPeriodSummaries() {
  const container = document.getElementById('periodSummaries');
  container.innerHTML = '';

  for (let i = 0; i < 3; i++) {
    const s = computePeriodSummary(i);
    const overHours = s.varianceMinutes > 0;
    const period = document.createElement('div');
    period.className = 'period-summary';
    period.innerHTML = `
      <h3>Period ${i + 1}</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <span class="label">Recorded Weeks</span>
          <strong>${s.recordedWeeks} / 4</strong>
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
  const s = computeCycleSummary();
  const varianceOver = s.varianceMinutes > 0;
  const weekendsOver = s.weekendsWorked > 6;

  document.getElementById('weeksRecorded').textContent = `${s.recordedWeeks} / 12`;
  document.getElementById('totalActualHours').textContent = minutesToHourString(s.totalMinutes);
  document.getElementById('avgWeeklyHours').textContent = s.recordedWeeks ? minutesToHourString(s.averageMinutes) : '0:00';

  const varianceEl = document.getElementById('weeklyVariance');
  varianceEl.textContent = s.recordedWeeks ? minutesToVarianceLabel(s.varianceMinutes) : 'Awaiting data';
  varianceEl.className = s.recordedWeeks ? statusClass(varianceOver) : '';

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
          <strong>${entry.startDate} to ${entry.endDate}</strong>
          <div>${entry.totalDays} day(s)</div>
          <div>${entry.medicalCertificate ? 'Medical certificate provided' : 'No medical certificate'}</div>
        </div>
      `).join('')
    : '<p class="subtle">No leave records for this year.</p>';
}

document.getElementById('cycleStartDate').addEventListener('change', e => {
  state.cycle.startDate = e.target.value;
  state.cycle.weeks.forEach((week, index) => {
    week.startDate = addDays(state.cycle.startDate, index * 7);
  });
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

document.getElementById('leaveYearFilter').addEventListener('input', renderLeaveSection);

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

render();
