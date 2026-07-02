const STORAGE_KEY = 'rosterLeaveTrackerState';
const WEEKS_IN_VIEW = 12;
const WEEKS_PER_PERIOD = 4;
const PERIODS_IN_VIEW = WEEKS_IN_VIEW / WEEKS_PER_PERIOD;
const CUSTOM_ROSTER_LINE_VALUE = '__custom_roster_line__';
const TEMPLATE_ROSTER_VALUE_PREFIX = '__template_roster__::';
const DEFAULT_ROSTER_FAMILY = 'ALEXANDER';

function normalizeRosterFamily(value) {
  return String(value || '').trim().toUpperCase();
}

function toDisplayRosterFamily(value) {
  const normalized = normalizeRosterFamily(value);
  if (!normalized) return '';
  return normalized.toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase());
}

function makeRosterWeeks(entries) {
  return entries.map(([hoursWorked, daysWorked, weekendWorked]) => ({
    hoursWorked,
    daysWorked,
    weekendWorked
  }));
}

const ALEXANDER_ROSTER_TEMPLATE = {
  vesselClass: 'First Fleet',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['41:15', 4, false],
      ['51:20', 5, true],
      ['36:40', 4, false],
      ['41:00', 4, true],
      ['39:30', 4, true],
      ['41:15', 4, false],
      ['53:35', 5, true],
      ['39:30', 4, false],
      ['39:00', 4, false],
      ['39:00', 4, true],
      ['39:00', 4, false],
      ['36:40', 4, true]
    ]),
    '1.2': makeRosterWeeks([
      ['39:30', 4, true],
      ['41:15', 4, false],
      ['53:35', 5, true],
      ['39:30', 4, false],
      ['50:45', 5, true],
      ['36:40', 4, false],
      ['39:00', 4, false],
      ['39:00', 4, false],
      ['41:00', 4, true],
      ['39:30', 4, false],
      ['41:15', 4, false],
      ['39:00', 4, true]
    ]),
    '1.3': makeRosterWeeks([
      ['50:45', 5, true],
      ['36:40', 4, false],
      ['39:00', 4, false],
      ['39:00', 4, false],
      ['41:15', 4, false],
      ['51:20', 5, true],
      ['36:40', 4, false],
      ['41:00', 4, true],
      ['39:30', 4, false],
      ['41:15', 4, false],
      ['39:30', 4, true],
      ['53:35', 5, true]
    ])
  }
};

const BORROWDALE_ROSTER_TEMPLATE = {
  vesselClass: 'First Fleet',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['46:23', 4, true],
      ['36:00', 3, false],
      ['46:23', 4, true],
      ['43:15', 4, false],
      ['46:23', 4, true],
      ['36:00', 3, false],
      ['46:23', 4, true],
      ['43:15', 4, false],
      ['46:23', 4, true],
      ['36:00', 3, false],
      ['46:23', 4, true],
      ['43:15', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['36:00', 3, false],
      ['46:23', 4, true],
      ['43:15', 4, false],
      ['46:23', 4, true],
      ['36:00', 3, false],
      ['46:23', 4, true],
      ['43:15', 4, false],
      ['46:23', 4, true],
      ['36:00', 3, false],
      ['46:23', 4, true],
      ['43:15', 4, false],
      ['46:23', 4, true]
    ])
  }
};

const LIZ_ELLIS_ROSTER_TEMPLATE = {
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    '1.1': makeRosterWeeks([
      ['46:00', 4, false],
      ['39:45', 4, true],
      ['46:00', 4, false],
      ['39:45', 4, true]
    ]),
    '1.2': makeRosterWeeks([
      ['39:45', 4, true],
      ['46:00', 4, false],
      ['39:45', 4, true],
      ['46:00', 4, false]
    ])
  }
};

const FISHBURN_ROSTER_TEMPLATE = {
  vesselClass: 'First Fleet',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['37:50', 4, false],
      ['49:20', 5, true],
      ['37:50', 4, false],
      ['37:50', 4, true],
      ['50:30', 5, true],
      ['40:10', 4, false],
      ['40:10', 4, true],
      ['40:10', 4, false],
      ['44:40', 4, false],
      ['37:50', 4, true],
      ['43:00', 4, false],
      ['49:20', 5, true]
    ]),
    '1.2': makeRosterWeeks([
      ['50:40', 5, true],
      ['40:10', 4, false],
      ['40:10', 4, true],
      ['40:10', 4, false],
      ['44:40', 4, false],
      ['37:50', 4, true],
      ['43:00', 4, false],
      ['49:20', 5, true],
      ['37:50', 4, false],
      ['49:20', 5, true],
      ['37:50', 4, false],
      ['37:50', 4, true]
    ]),
    '1.3': makeRosterWeeks([
      ['44:40', 4, false],
      ['37:50', 4, true],
      ['43:00', 4, false],
      ['49:20', 5, true],
      ['37:50', 4, false],
      ['49:20', 5, true],
      ['37:50', 4, false],
      ['37:50', 4, true],
      ['50:30', 5, true],
      ['40:10', 4, false],
      ['40:10', 4, true],
      ['40:10', 4, false]
    ])
  }
};

const FRIENDSHIP_ROSTER_TEMPLATE = {
  vesselClass: 'First Fleet',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['51:20', 5, true],
      ['38:20', 4, false],
      ['39:30', 4, true],
      ['39:40', 4, false],
      ['39:40', 4, false],
      ['44:10', 4, true],
      ['38:40', 4, false],
      ['53:25', 5, true],
      ['36:45', 4, true],
      ['39:40', 4, false],
      ['52:00', 5, true],
      ['38:40', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['39:40', 4, false],
      ['44:10', 4, true],
      ['38:40', 4, false],
      ['53:25', 5, true],
      ['36:45', 4, true],
      ['39:40', 4, false],
      ['52:00', 5, true],
      ['38:40', 4, false],
      ['51:20', 5, true],
      ['38:20', 4, false],
      ['39:30', 4, true],
      ['39:40', 4, false]
    ]),
    '1.3': makeRosterWeeks([
      ['36:45', 4, true],
      ['39:40', 4, false],
      ['52:00', 5, true],
      ['38:40', 4, false],
      ['51:20', 5, true],
      ['38:20', 4, false],
      ['39:30', 4, true],
      ['39:40', 4, false],
      ['39:40', 4, false],
      ['44:10', 4, true],
      ['38:40', 4, false],
      ['53:25', 5, true]
    ])
  }
};

const GOLDEN_GROVE_ROSTER_TEMPLATE = {
  vesselClass: 'First Fleet',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['49:05', 5, true],
      ['39:30', 4, false],
      ['38:05', 4, true],
      ['39:30', 4, false],
      ['39:20', 4, false],
      ['51:15', 5, true],
      ['42:00', 4, false],
      ['41:15', 4, true],
      ['40:45', 4, true],
      ['42:00', 4, false],
      ['49:05', 5, true],
      ['42:00', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['39:20', 4, false],
      ['51:15', 5, true],
      ['42:00', 4, false],
      ['41:15', 4, true],
      ['40:45', 4, true],
      ['42:00', 4, false],
      ['49:05', 5, true],
      ['42:00', 4, false],
      ['49:05', 5, true],
      ['39:30', 4, false],
      ['38:05', 4, true],
      ['39:30', 4, false]
    ]),
    '1.3': makeRosterWeeks([
      ['40:45', 4, true],
      ['42:00', 4, false],
      ['49:05', 5, true],
      ['42:00', 4, false],
      ['49:05', 5, true],
      ['39:30', 4, false],
      ['38:05', 4, true],
      ['39:30', 4, false],
      ['39:20', 4, false],
      ['51:15', 5, true],
      ['42:00', 4, false],
      ['41:15', 4, true]
    ])
  }
};

const SCARBOROUGH_ROSTER_TEMPLATE = {
  vesselClass: 'First Fleet',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['38:50', 4, true],
      ['41:45', 4, false],
      ['46:15', 5, true],
      ['41:45', 4, false],
      ['38:05', 4, false],
      ['41:35', 4, false],
      ['45:15', 4, false],
      ['49:00', 5, true],
      ['41:35', 4, false],
      ['46:15', 5, true],
      ['39:00', 4, false],
      ['38:50', 4, true]
    ]),
    '1.2': makeRosterWeeks([
      ['38:05', 4, false],
      ['41:35', 4, false],
      ['45:15', 4, false],
      ['49:00', 5, true],
      ['41:35', 4, false],
      ['46:15', 5, true],
      ['39:00', 4, false],
      ['38:50', 4, true],
      ['38:50', 4, true],
      ['41:45', 4, false],
      ['46:15', 5, true],
      ['41:45', 4, false]
    ]),
    '1.3': makeRosterWeeks([
      ['41:35', 4, false],
      ['46:15', 5, true],
      ['39:00', 4, false],
      ['38:50', 4, true],
      ['38:50', 4, true],
      ['41:45', 4, false],
      ['46:15', 5, true],
      ['41:45', 4, false],
      ['38:05', 4, false],
      ['41:35', 4, false],
      ['45:15', 4, false],
      ['49:00', 5, true]
    ])
  }
};

const SUPPLY_ROSTER_TEMPLATE = {
  vesselClass: 'First Fleet',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['36:40', 4, false],
      ['38:25', 4, true],
      ['42:00', 4, false],
      ['50:10', 5, true],
      ['42:40', 4, true],
      ['41:10', 4, false],
      ['53:50', 5, true],
      ['39:10', 4, false],
      ['39:10', 4, false],
      ['50:10', 5, true],
      ['36:40', 4, false],
      ['38:25', 4, true]
    ]),
    '1.2': makeRosterWeeks([
      ['42:40', 4, true],
      ['41:10', 4, false],
      ['53:50', 5, true],
      ['39:10', 4, false],
      ['39:10', 4, false],
      ['50:10', 5, true],
      ['36:40', 4, false],
      ['38:25', 4, true],
      ['36:40', 4, false],
      ['38:25', 4, true],
      ['42:00', 4, false],
      ['50:10', 5, true]
    ]),
    '1.3': makeRosterWeeks([
      ['39:10', 4, false],
      ['50:10', 5, true],
      ['36:40', 4, false],
      ['38:25', 4, true],
      ['36:40', 4, false],
      ['38:25', 4, true],
      ['42:00', 4, false],
      ['50:10', 5, true],
      ['42:40', 4, true],
      ['41:10', 4, false],
      ['53:50', 5, true],
      ['39:10', 4, false]
    ])
  }
};

const PEMULWUY_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 1 Emerald',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['48:00', 4, true],
      ['48:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false]
    ]),
    '1.2': makeRosterWeeks([
      ['48:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true]
    ])
  }
};

const BUNGAREE_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 1 Emerald',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['48:00', 4, true],
      ['48:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false]
    ]),
    '1.2': makeRosterWeeks([
      ['48:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true]
    ])
  }
};

const FRED_HOLLOWS_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 1 Emerald',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['40:20', 4, true],
      ['38:05', 4, false],
      ['45:55', 5, true],
      ['44:30', 4, false],
      ['38:40', 4, true],
      ['41:35', 4, false],
      ['51:45', 5, true],
      ['41:00', 4, false],
      ['39:50', 4, false],
      ['39:10', 4, true],
      ['39:50', 4, false],
      ['46:30', 5, true]
    ]),
    '1.2': makeRosterWeeks([
      ['39:50', 4, false],
      ['39:10', 4, true],
      ['39:50', 4, false],
      ['46:30', 5, true],
      ['40:20', 4, true],
      ['38:05', 4, false],
      ['45:55', 5, true],
      ['44:30', 4, false],
      ['38:40', 4, true],
      ['41:35', 4, false],
      ['51:45', 5, true],
      ['41:00', 4, false]
    ]),
    '1.3': makeRosterWeeks([
      ['38:40', 4, true],
      ['41:35', 4, false],
      ['51:45', 5, true],
      ['41:00', 4, false],
      ['39:50', 4, false],
      ['39:10', 4, true],
      ['39:50', 4, false],
      ['46:30', 5, true],
      ['40:20', 4, true],
      ['38:05', 4, false],
      ['45:55', 5, true],
      ['44:30', 4, false]
    ])
  }
};

const VICTOR_CHANG_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 1 Emerald',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['48:45', 5, true],
      ['44:35', 4, false],
      ['36:45', 4, true],
      ['44:35', 4, false],
      ['47:50', 5, true],
      ['37:45', 4, false],
      ['44:35', 4, false],
      ['39:15', 4, true],
      ['41:10', 4, false],
      ['36:45', 4, true],
      ['37:45', 4, false],
      ['41:55', 5, true]
    ]),
    '1.2': makeRosterWeeks([
      ['41:10', 4, false],
      ['36:45', 4, true],
      ['37:45', 4, false],
      ['41:55', 5, true],
      ['48:45', 5, true],
      ['44:35', 4, false],
      ['36:45', 4, true],
      ['44:35', 4, false],
      ['47:50', 5, true],
      ['37:45', 4, false],
      ['44:35', 4, false],
      ['39:15', 4, true]
    ]),
    '1.3': makeRosterWeeks([
      ['47:50', 5, true],
      ['37:45', 4, false],
      ['44:35', 4, false],
      ['39:15', 4, true],
      ['41:10', 4, false],
      ['36:45', 4, true],
      ['37:45', 4, false],
      ['41:55', 5, true],
      ['48:45', 5, true],
      ['44:35', 4, false],
      ['36:45', 4, true],
      ['44:35', 4, false]
    ])
  }
};

const MAY_GIBBS_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 1 Emerald',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['42:00', 4, false],
      ['46:25', 5, true],
      ['42:00', 4, false],
      ['40:25', 4, true],
      ['38:00', 4, false],
      ['51:40', 5, true],
      ['43:00', 4, false],
      ['42:00', 4, false],
      ['39:25', 4, true],
      ['40:00', 4, false],
      ['49:25', 5, true],
      ['40:00', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['39:25', 4, true],
      ['40:00', 4, false],
      ['49:25', 5, true],
      ['40:00', 4, false],
      ['42:00', 4, false],
      ['46:25', 5, true],
      ['42:00', 4, false],
      ['40:25', 4, true],
      ['38:00', 4, false],
      ['51:40', 5, true],
      ['43:00', 4, false],
      ['42:00', 4, false]
    ]),
    '1.3': makeRosterWeeks([
      ['38:00', 4, false],
      ['51:40', 5, true],
      ['43:00', 4, false],
      ['42:00', 4, false],
      ['39:25', 4, true],
      ['40:00', 4, false],
      ['49:25', 5, true],
      ['40:00', 4, false],
      ['42:00', 4, false],
      ['46:25', 5, true],
      ['42:00', 4, false],
      ['40:25', 4, true]
    ])
  }
};

const E_C_CRIB_RELIEF_ROSTER_TEMPLATE = {
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 12,
  lines: {
    '1.1': makeRosterWeeks([
      ['37:30', 4, false],
      ['47:45', 5, true],
      ['37:30', 4, false],
      ['44:30', 4, true],
      ['36:00', 4, false],
      ['39:15', 4, true],
      ['36:00', 4, false],
      ['45:45', 5, true],
      ['42:00', 4, false],
      ['46:30', 4, true],
      ['42:00', 4, false],
      ['48:45', 5, true]
    ]),
    '1.2': makeRosterWeeks([
      ['38:45', 4, true],
      ['37:30', 4, false],
      ['47:15', 5, true],
      ['37:30', 4, false],
      ['39:45', 4, true],
      ['36:00', 4, false],
      ['51:00', 5, true],
      ['36:00', 4, false],
      ['46:30', 4, true],
      ['42:00', 4, false],
      ['49:15', 5, true],
      ['42:00', 4, false]
    ]),
    '1.3': makeRosterWeeks([
      ['42:00', 4, false],
      ['46:30', 4, true],
      ['42:00', 4, false],
      ['48:45', 5, true],
      ['37:30', 4, false],
      ['47:45', 5, true],
      ['37:30', 4, false],
      ['44:30', 4, true],
      ['36:00', 4, false],
      ['39:15', 4, true],
      ['36:00', 4, false],
      ['45:45', 5, true]
    ]),
    '1.4': makeRosterWeeks([
      ['46:30', 4, true],
      ['42:00', 4, false],
      ['49:15', 5, true],
      ['42:00', 4, false],
      ['38:45', 4, true],
      ['37:30', 4, false],
      ['47:15', 5, true],
      ['37:30', 4, false],
      ['39:45', 4, true],
      ['36:00', 4, false],
      ['51:00', 5, true],
      ['36:00', 4, false]
    ]),
    '1.5': makeRosterWeeks([
      ['36:00', 4, false],
      ['39:15', 4, true],
      ['36:00', 4, false],
      ['45:45', 5, true],
      ['42:00', 4, false],
      ['46:30', 4, true],
      ['42:00', 4, false],
      ['48:45', 5, true],
      ['37:30', 4, false],
      ['47:45', 5, true],
      ['37:30', 4, false],
      ['44:30', 4, true]
    ]),
    '1.6': makeRosterWeeks([
      ['39:45', 4, true],
      ['36:00', 4, false],
      ['51:00', 5, true],
      ['36:00', 4, false],
      ['46:30', 4, true],
      ['42:00', 4, false],
      ['49:15', 5, true],
      ['42:00', 4, false],
      ['38:45', 4, true],
      ['37:30', 4, false],
      ['47:15', 5, true],
      ['37:30', 4, false]
    ])
  }
};

const FRESHWATER_COLLAROY_ROSTER_TEMPLATE = {
  vesselClass: 'Freshwater',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 8,
  lines: {
    '1.1': makeRosterWeeks([
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['44:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false]
    ]),
    '1.2': makeRosterWeeks([
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['44:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true]
    ]),
    '1.3': makeRosterWeeks([
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['44:00', 4, false],
      ['48:00', 4, true]
    ]),
    '1.4': makeRosterWeeks([
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['48:00', 4, true],
      ['44:00', 4, false]
    ])
  }
};

const FRESHWATER_COLLAROY_FW11_ROSTER_TEMPLATE = {
  vesselClass: 'Freshwater',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    A: makeRosterWeeks([
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['46:45', 4, false]
    ]),
    B: makeRosterWeeks([
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['46:45', 4, false]
    ])
  }
};

const FRESHWATER_COLLAROY_FW12_ROSTER_TEMPLATE = {
  vesselClass: 'Freshwater',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    A: makeRosterWeeks([
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['46:45', 4, false],
      ['48:00', 4, true]
    ]),
    B: makeRosterWeeks([
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['46:45', 4, false],
      ['48:00', 4, true]
    ])
  }
};

const FRESHWATER_COLLAROY_FW13_ROSTER_TEMPLATE = {
  vesselClass: 'Freshwater',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    A: makeRosterWeeks([
      ['48:00', 4, true],
      ['46:45', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false]
    ]),
    B: makeRosterWeeks([
      ['48:00', 4, true],
      ['46:45', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false]
    ])
  }
};

const FRESHWATER_COLLAROY_FW14_ROSTER_TEMPLATE = {
  vesselClass: 'Freshwater',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    A: makeRosterWeeks([
      ['46:45', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true]
    ]),
    B: makeRosterWeeks([
      ['46:45', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true]
    ])
  }
};

const BALMORAL_FAID_76_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 2 Emerald',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    '1.1': makeRosterWeeks([
      ['42:20', 4, true],
      ['42:30', 4, false],
      ['39:20', 4, true],
      ['46:25', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['46:25', 4, false],
      ['42:20', 4, true],
      ['42:30', 4, false],
      ['39:20', 4, true]
    ]),
    '1.3': makeRosterWeeks([
      ['42:30', 4, false],
      ['39:20', 4, true],
      ['46:25', 4, false],
      ['42:20', 4, true]
    ]),
    '1.4': makeRosterWeeks([
      ['39:20', 4, true],
      ['46:25', 4, false],
      ['42:20', 4, true],
      ['42:30', 4, false]
    ])
  }
};

const BALMORAL_FAID_78_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 2 Emerald',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    '1.1': makeRosterWeeks([
      ['42:20', 4, true],
      ['40:30', 4, false],
      ['51:20', 5, true],
      ['43:40', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['43:40', 4, false],
      ['42:20', 4, true],
      ['40:30', 4, false],
      ['51:20', 5, true]
    ]),
    '1.3': makeRosterWeeks([
      ['40:30', 4, false],
      ['51:20', 5, true],
      ['43:40', 4, false],
      ['42:20', 4, true]
    ]),
    '1.4': makeRosterWeeks([
      ['51:20', 5, true],
      ['43:40', 4, false],
      ['42:20', 4, true],
      ['40:30', 4, false]
    ])
  }
};

const FAIRLIGHT_MASTERS_ENGINEERS_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 2 Emerald',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    '1.1': makeRosterWeeks([
      ['39:40', 4, true],
      ['39:15', 4, false],
      ['40:30', 4, true],
      ['48:00', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['48:00', 4, false],
      ['39:40', 4, true],
      ['39:15', 4, false],
      ['40:30', 4, true]
    ]),
    '1.3': makeRosterWeeks([
      ['39:15', 4, false],
      ['40:30', 4, true],
      ['48:00', 4, false],
      ['39:40', 4, true]
    ]),
    '1.4': makeRosterWeeks([
      ['40:30', 4, true],
      ['48:00', 4, false],
      ['39:40', 4, true],
      ['39:15', 4, false]
    ])
  }
};

const FAIRLIGHT_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 2 Emerald',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    '1.1': makeRosterWeeks([
      ['51:40', 5, true],
      ['37:15', 4, false],
      ['40:30', 4, true],
      ['48:00', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['48:00', 4, false],
      ['51:40', 5, true],
      ['37:15', 4, false],
      ['40:30', 4, true]
    ]),
    '1.3': makeRosterWeeks([
      ['37:15', 4, false],
      ['40:30', 4, true],
      ['48:00', 4, false],
      ['51:40', 5, true]
    ]),
    '1.4': makeRosterWeeks([
      ['40:30', 4, true],
      ['48:00', 4, false],
      ['51:40', 5, true],
      ['37:15', 4, false]
    ])
  }
};

const CLONTARF_MASTERS_ENGINEERS_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 2 Emerald',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    '1.1': makeRosterWeeks([
      ['39:30', 4, true],
      ['43:20', 4, false],
      ['44:30', 4, true],
      ['40:45', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['40:45', 4, false],
      ['39:30', 4, true],
      ['43:20', 4, false],
      ['44:30', 4, true]
    ]),
    '1.3': makeRosterWeeks([
      ['43:20', 4, false],
      ['44:30', 4, true],
      ['40:45', 4, false],
      ['39:30', 4, true]
    ]),
    '1.4': makeRosterWeeks([
      ['44:30', 4, false],
      ['40:45', 4, false],
      ['39:30', 4, true],
      ['43:20', 4, true]
    ])
  }
};

const CLONTARF_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Gen 2 Emerald',
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    '1.1': makeRosterWeeks([
      ['49:30', 5, true],
      ['43:20', 4, false],
      ['44:30', 4, true],
      ['40:45', 4, false]
    ]),
    '1.2': makeRosterWeeks([
      ['40:45', 4, false],
      ['49:30', 5, true],
      ['43:20', 4, false],
      ['44:30', 4, true]
    ]),
    '1.3': makeRosterWeeks([
      ['43:20', 4, false],
      ['44:30', 4, true],
      ['40:45', 4, false],
      ['49:30', 5, true]
    ]),
    '1.4': makeRosterWeeks([
      ['44:30', 4, true],
      ['40:45', 4, false],
      ['49:30', 5, true],
      ['43:20', 4, false]
    ])
  }
};

const CRIB_RELIEF_MASTERS_ENGINEERS_ROSTER_TEMPLATE = {
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 8,
  lines: {
    'CR1.1': makeRosterWeeks([
      ['48:00', 4, true],
      ['44:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false]
    ]),
    'CR1.2': makeRosterWeeks([
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['44:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true]
    ])
  }
};

const CRIB_RELIEF_GPH_ROSTER_TEMPLATE = {
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    'CR1.1': makeRosterWeeks([
      ['48:00', 4, true],
      ['48:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false]
    ]),
    'CR1.2': makeRosterWeeks([
      ['48:00', 4, false],
      ['48:00', 4, true],
      ['36:00', 3, false],
      ['48:00', 4, true]
    ])
  }
};

const WAD_CREW_ROSTER_TEMPLATE = {
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 2,
  lines: {
    'OW1.1': makeRosterWeeks([
      ['43:00', 4, false],
      ['43:00', 4, true]
    ]),
    'OW1.2': makeRosterWeeks([
      ['43:00', 4, true],
      ['43:00', 4, false]
    ])
  }
};

const WAD_ROSTER_TEMPLATE = {
  areaOfOperations: 'Outer Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 1,
  lines: {
    'OW1.1': makeRosterWeeks([
      ['43:00', 4, false]
    ])
  }
};

const ZOO_WHARF_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS01: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS02: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ])
  }
};

const NO1_WHARF_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS03: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS04: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ])
  }
};

const NO2_WHARF_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS05: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS06: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ])
  }
};

const THREE_WHARF_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS07: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS08: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ])
  }
};

const THREE_WHARF_WEST_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    '3WX.1': makeRosterWeeks([
      ['42:00', 4, true],
      ['48:00', 4, false],
      ['42:00', 4, true],
      ['48:00', 4, false]
    ]),
    '3WX.2': makeRosterWeeks([
      ['48:00', 4, false],
      ['42:00', 4, true],
      ['48:00', 4, false],
      ['42:00', 4, true]
    ])
  }
};

const THREE_GATE_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS09: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ]),
    GWS10: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS11: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ]),
    GWS12: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ])
  }
};

const FOUR_WHARF_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS13: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS14: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ])
  }
};

const FOUR_GATE_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS15: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS16: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ])
  }
};

const FIVE_WHARF_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS21: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS22: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ])
  }
};

const FIVE_GATE_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS23: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ]),
    GWS24: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ])
  }
};

const BALMAIN_SHIPKEEPERS_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS29: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS30: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ]),
    GWS31: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS32: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ])
  }
};

const CQ_CRIB_RELIEF_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS48: makeRosterWeeks([
      ['43:15', 4, false],
      ['46:45', 4, true],
      ['43:15', 4, false],
      ['46:45', 4, true]
    ]),
    GWS49: makeRosterWeeks([
      ['46:45', 4, true],
      ['43:15', 4, false],
      ['46:45', 4, true],
      ['43:15', 4, false]
    ])
  }
};

const CIRCULAR_QUAY_TEAM_LEADERS_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    CQTL01: makeRosterWeeks([
      ['44:00', 5, true],
      ['47:15', 3, true],
      ['40:45', 5, true],
      ['40:30', 3, false]
    ]),
    CQTL02: makeRosterWeeks([
      ['40:45', 5, true],
      ['40:30', 5, false],
      ['44:00', 3, true],
      ['47:15', 5, true]
    ]),
    CQTL03: makeRosterWeeks([
      ['47:15', 5, true],
      ['40:45', 5, true],
      ['40:30', 3, false],
      ['44:00', 5, true]
    ]),
    CQTL04: makeRosterWeeks([
      ['40:30', 5, false],
      ['44:00', 5, true],
      ['47:15', 3, true],
      ['40:45', 5, true]
    ])
  }
};

const BARANGAROO_TEAM_LEADER_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    BTL01: makeRosterWeeks([
      ['42:00', 4, true],
      ['48:00', 4, false],
      ['42:00', 4, true],
      ['48:00', 4, false]
    ]),
    BTL02: makeRosterWeeks([
      ['48:00', 4, false],
      ['42:00', 4, true],
      ['48:00', 4, false],
      ['42:00', 4, true]
    ])
  }
};

const PPT_4_GATE_CRIBS_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS48: makeRosterWeeks([
      ['30:55', 5, true],
      ['26:45', 3, false],
      ['30:55', 5, true],
      ['26:45', 3, false]
    ])
  }
};

const MANLY_WHARF_GPH_A_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS33: makeRosterWeeks([
      ['50:40', 5, true],
      ['36:00', 3, false],
      ['48:00', 5, true],
      ['43:50', 3, false]
    ]),
    GWS34: makeRosterWeeks([
      ['48:00', 5, true],
      ['43:50', 5, false],
      ['48:00', 3, true],
      ['38:40', 5, false]
    ]),
    GWS35: makeRosterWeeks([
      ['48:00', 5, true],
      ['38:40', 5, false],
      ['50:40', 3, true],
      ['36:00', 5, false]
    ])
  }
};

const MANLY_WHARF_GPH_B_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS36: makeRosterWeeks([
      ['36:00', 5, true],
      ['48:00', 3, true],
      ['43:50', 5, false],
      ['48:00', 3, true]
    ]),
    GWS37: makeRosterWeeks([
      ['43:50', 5, false],
      ['50:40', 5, true],
      ['38:40', 3, false],
      ['50:40', 5, true]
    ]),
    GWS38: makeRosterWeeks([
      ['38:40', 5, false],
      ['48:00', 5, true],
      ['36:00', 3, false],
      ['48:00', 5, true]
    ])
  }
};

const MANLY_WHARF_GPH_C_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS39: makeRosterWeeks([
      ['50:30', 5, true],
      ['40:00', 3, false],
      ['47:05', 5, true],
      ['42:20', 3, false]
    ]),
    GWS40: makeRosterWeeks([
      ['40:00', 5, false],
      ['47:05', 5, true],
      ['42:20', 3, false],
      ['50:30', 5, true]
    ]),
    GWS41: makeRosterWeeks([
      ['47:05', 5, true],
      ['42:20', 5, false],
      ['50:30', 3, true],
      ['40:00', 5, false]
    ]),
    GWS42: makeRosterWeeks([
      ['42:20', 5, false],
      ['50:30', 5, true],
      ['40:00', 3, false],
      ['47:05', 5, true]
    ])
  }
};

const MANLY_TEAM_LEADER_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Inner Harbour',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    MTL01: makeRosterWeeks([
      ['43:30', 5, true],
      ['43:15', 5, true],
      ['38:15', 5, true],
      ['51:30', 5, true]
    ]),
    MTL02: makeRosterWeeks([
      ['43:15', 5, true],
      ['38:15', 5, true],
      ['51:30', 5, true],
      ['43:30', 5, true]
    ]),
    MTL03: makeRosterWeeks([
      ['38:15', 5, true],
      ['51:30', 5, true],
      ['43:30', 5, true],
      ['43:15', 5, true]
    ]),
    MTL04: makeRosterWeeks([
      ['51:30', 5, true],
      ['43:30', 5, true],
      ['43:15', 5, true],
      ['38:15', 5, true]
    ])
  }
};

const BARANGAROO_GATE_WHARF_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS43: makeRosterWeeks([
      ['48:00', 4, true],
      ['48:00', 4, false],
      ['36:00', 3, true],
      ['48:00', 4, false]
    ]),
    GWS44: makeRosterWeeks([
      ['48:00', 4, false],
      ['48:00', 4, true],
      ['48:00', 4, false],
      ['36:00', 3, true]
    ]),
    GWS45: makeRosterWeeks([
      ['36:00', 3, true],
      ['48:00', 4, false],
      ['48:00', 4, true],
      ['48:00', 4, false]
    ]),
    GWS46: makeRosterWeeks([
      ['48:00', 4, false],
      ['36:00', 3, true],
      ['48:00', 4, false],
      ['48:00', 4, true]
    ])
  }
};

const BARANGAROO_GATE_WHARF_2_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS54: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS55: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ]),
    GWS56: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS57: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ])
  }
};

const FOUR_GATE_WHARF_CQ_NIGHT_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS17: makeRosterWeeks([
      ['48:00', 4, true],
      ['42:00', 4, false],
      ['48:00', 4, true],
      ['42:00', 4, false]
    ]),
    GWS18: makeRosterWeeks([
      ['48:00', 4, true],
      ['42:00', 4, false],
      ['48:00', 4, true],
      ['42:00', 4, false]
    ]),
    GWS19: makeRosterWeeks([
      ['42:00', 4, false],
      ['48:00', 4, true],
      ['42:00', 4, false],
      ['48:00', 4, true]
    ]),
    GWS20: makeRosterWeeks([
      ['42:00', 4, false],
      ['48:00', 4, true],
      ['42:00', 4, false],
      ['48:00', 4, true]
    ])
  }
};

const THREE_GATE_WHARF_CQ_NIGHT_GPH_ROSTER_TEMPLATE = {
  vesselClass: 'Shore Based',
  areaOfOperations: 'Shore Based',
  anchorDate: '2026-01-05',
  cycleLengthWeeks: 4,
  lines: {
    GWS25: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ]),
    GWS26: makeRosterWeeks([
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true]
    ]),
    GWS27: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ]),
    GWS28: makeRosterWeeks([
      ['54:00', 5, true],
      ['36:00', 3, false],
      ['54:00', 5, true],
      ['36:00', 3, false]
    ])
  }
};

function getDefaultRosterTemplates() {
  return {
    [DEFAULT_ROSTER_FAMILY]: ALEXANDER_ROSTER_TEMPLATE,
    BORROWDALE: BORROWDALE_ROSTER_TEMPLATE,
    'LIZ ELLIS': LIZ_ELLIS_ROSTER_TEMPLATE,
    FISHBURN: FISHBURN_ROSTER_TEMPLATE,
    FRIENDSHIP: FRIENDSHIP_ROSTER_TEMPLATE,
    'GOLDEN GROVE': GOLDEN_GROVE_ROSTER_TEMPLATE,
    SCARBOROUGH: SCARBOROUGH_ROSTER_TEMPLATE,
    SUPPLY: SUPPLY_ROSTER_TEMPLATE,
    PEMULWUY: PEMULWUY_ROSTER_TEMPLATE,
    BUNGAREE: BUNGAREE_ROSTER_TEMPLATE,
    'FRED HOLLOWS': FRED_HOLLOWS_ROSTER_TEMPLATE,
    'VICTOR CHANG': VICTOR_CHANG_ROSTER_TEMPLATE,
    'MAY GIBBS': MAY_GIBBS_ROSTER_TEMPLATE,
    'E C CRIB/RELIEF': E_C_CRIB_RELIEF_ROSTER_TEMPLATE,
    'FRESHWATER - COLLAROY': FRESHWATER_COLLAROY_ROSTER_TEMPLATE,
    'FRESHWATER - COLLAROY - FW1.1': FRESHWATER_COLLAROY_FW11_ROSTER_TEMPLATE,
    'FRESHWATER - COLLAROY - FW1.2': FRESHWATER_COLLAROY_FW12_ROSTER_TEMPLATE,
    'FRESHWATER - COLLAROY - FW1.3': FRESHWATER_COLLAROY_FW13_ROSTER_TEMPLATE,
    'FRESHWATER - COLLAROY - FW1.4': FRESHWATER_COLLAROY_FW14_ROSTER_TEMPLATE,
    'BALMORAL - MASTERS/ENGINEERS': BALMORAL_FAID_76_ROSTER_TEMPLATE,
    'BALMORAL - GPH': BALMORAL_FAID_78_ROSTER_TEMPLATE,
    'FAIRLIGHT - MASTERS/ENGINEERS': FAIRLIGHT_MASTERS_ENGINEERS_ROSTER_TEMPLATE,
    'FAIRLIGHT - GPH': FAIRLIGHT_GPH_ROSTER_TEMPLATE,
    'CLONTARF - MASTERS/ENGINEERS': CLONTARF_MASTERS_ENGINEERS_ROSTER_TEMPLATE,
    'CLONTARF - GPH': CLONTARF_GPH_ROSTER_TEMPLATE,
    'CRIB RELIEF - MASTERS/ENGINEERS': CRIB_RELIEF_MASTERS_ENGINEERS_ROSTER_TEMPLATE,
    'CRIB RELIEF - GPH': CRIB_RELIEF_GPH_ROSTER_TEMPLATE,
    'WAD CREW - MASTERS': WAD_CREW_ROSTER_TEMPLATE,
    'WAD ROSTER - ENGINEERS': WAD_ROSTER_TEMPLATE,
    'ZOO WHARF - GPH': ZOO_WHARF_GPH_ROSTER_TEMPLATE,
    '2 WHARF - GPH': NO1_WHARF_GPH_ROSTER_TEMPLATE,
    '2 GATE - GPH': NO2_WHARF_GPH_ROSTER_TEMPLATE,
    '3 WHARF - GPH': THREE_WHARF_GPH_ROSTER_TEMPLATE,
    '3 WHARF WEST - GPH': THREE_WHARF_WEST_GPH_ROSTER_TEMPLATE,
    '3 GATE - GPH': THREE_GATE_GPH_ROSTER_TEMPLATE,
    '4 WHARF - GPH': FOUR_WHARF_GPH_ROSTER_TEMPLATE,
    '4 GATE - GPH': FOUR_GATE_GPH_ROSTER_TEMPLATE,
    '5 WHARF - GPH': FIVE_WHARF_GPH_ROSTER_TEMPLATE,
    '5 GATE - GPH': FIVE_GATE_GPH_ROSTER_TEMPLATE,
    '4 GATE & WHARF CQ NIGHT - GPH': FOUR_GATE_WHARF_CQ_NIGHT_GPH_ROSTER_TEMPLATE,
    '3 GATE & WHARF CQ NIGHT - GPH': THREE_GATE_WHARF_CQ_NIGHT_GPH_ROSTER_TEMPLATE,
    'BALMAIN SHIPKEEPERS - GPH': BALMAIN_SHIPKEEPERS_GPH_ROSTER_TEMPLATE,
    'CQ CRIB RELIEF - GPH': CQ_CRIB_RELIEF_GPH_ROSTER_TEMPLATE,
    'CIRCULAR QUAY - TEAM LEADERS': CIRCULAR_QUAY_TEAM_LEADERS_ROSTER_TEMPLATE,
    'BARANGAROO TEAM LEADER': BARANGAROO_TEAM_LEADER_ROSTER_TEMPLATE,
    'PPT 4 GATE & CRIBS - GPH': PPT_4_GATE_CRIBS_GPH_ROSTER_TEMPLATE,
    'MANLY WHARF - GPH A': MANLY_WHARF_GPH_A_ROSTER_TEMPLATE,
    'MANLY WHARF - GPH B': MANLY_WHARF_GPH_B_ROSTER_TEMPLATE,
    'MANLY GATE - GPH': MANLY_WHARF_GPH_C_ROSTER_TEMPLATE,
    'MANLY TEAM LEADER': MANLY_TEAM_LEADER_ROSTER_TEMPLATE,
    'BARANGAROO GATE & WHARF - GPH': BARANGAROO_GATE_WHARF_GPH_ROSTER_TEMPLATE,
    'BARANGAROO GATE & WHARF 2 - GPH': BARANGAROO_GATE_WHARF_2_GPH_ROSTER_TEMPLATE,
  };
}

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
    rosterFamily: DEFAULT_ROSTER_FAMILY,
    rosterLine: '',
    hoursWorked: '',
    daysWorked: '',
    weekendWorked: null,
    manualRosterText: '',
    collapsed: true,
    ...overrides,
    startDate
  };
}

function normalizeRosterLine(week = {}) {
  const nextWeek = { ...week };
  nextWeek.rosterFamily = typeof nextWeek.rosterFamily === 'string' && nextWeek.rosterFamily.trim()
    ? normalizeRosterFamily(nextWeek.rosterFamily)
    : DEFAULT_ROSTER_FAMILY;
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
    activeRosterFamily: DEFAULT_ROSTER_FAMILY,
    weeklyHoursBaseline: '43:00',
    daysBaselinePerPeriod: 17,
    settingsCollapsed: true,
    weeklyEntriesCollapsed: true,
    periodSummariesCollapsed: true,
    summaryCollapsed: true,
    leaveTrackerCollapsed: true,
    leavePeriodMode: 'calendar',
    rolling12WeekSummaryEnabled: false,
    manualRosterOnlyMode: false
  },
  rosterTemplates: getDefaultRosterTemplates(),
  timeline: {
    windowStartDate: initialMonday,
    weeksByStart: {
      [initialMonday]: createWeek(initialMonday)
    }
  },
  leaveEntries: []
};

let state = applyCollapsedDefaults(loadState());

const DEPRECATED_BUILT_IN_ROSTER_FAMILIES = [
  'WAD CREW',
  'WAD ROSTER',
  'CRIB RELIEF - MASTERS/ENGINEERS',
  'CRIB RELIEF - GPH',
  'BALMORAL FAID 76',
  'BALMORAL FAID 78',
  'BALMORAL_FAID_76',
  'BALMORAL_FAID_78',
  'BALMORAL - FAID 76',
  'BALMORAL - FAID 78',
  'NO1 WHARF - GPH',
  'NO2 WHARF - GPH',
  'MANLY WHARF - GPH C'
];

function ensureBuiltInRosterTemplates() {
  const defaults = getDefaultRosterTemplates();
  const currentTemplates = state.rosterTemplates && typeof state.rosterTemplates === 'object'
    ? state.rosterTemplates
    : {};

  const cleanedTemplates = Object.fromEntries(
    Object.entries(currentTemplates).filter(
      ([key]) => !DEPRECATED_BUILT_IN_ROSTER_FAMILIES.includes(normalizeRosterFamily(key)) &&
                 !DEPRECATED_BUILT_IN_ROSTER_FAMILIES.includes(key.toUpperCase())
    )
  );

  state.rosterTemplates = {
    ...defaults,
    ...cleanedTemplates
  };
}

ensureBuiltInRosterTemplates();

function applyCollapsedDefaults(nextState) {
  nextState.settings.settingsCollapsed = true;
  nextState.settings.weeklyEntriesCollapsed = true;
  nextState.settings.periodSummariesCollapsed = true;
  nextState.settings.summaryCollapsed = true;
  nextState.settings.leaveTrackerCollapsed = true;
  nextState.settings.leavePeriodMode = nextState.settings.leavePeriodMode === 'rolling' ? 'rolling' : 'calendar';
  nextState.settings.rolling12WeekSummaryEnabled = Boolean(nextState.settings.rolling12WeekSummaryEnabled);
  nextState.settings.manualRosterOnlyMode = Boolean(nextState.settings.manualRosterOnlyMode);

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
  const defaultTemplates = getDefaultRosterTemplates();

  if (parsed.settings) {
    merged.settings.cycleStartDate = parsed.settings.cycleStartDate
      || parsed.timeline?.windowStartDate
      || merged.settings.cycleStartDate;
    merged.settings.activeRosterFamily = normalizeRosterFamily(parsed.settings.activeRosterFamily) || merged.settings.activeRosterFamily;
    merged.settings.weeklyHoursBaseline = parsed.settings.weeklyHoursBaseline || merged.settings.weeklyHoursBaseline;
    merged.settings.daysBaselinePerPeriod = Number.isFinite(parsed.settings.daysBaselinePerPeriod)
      ? parsed.settings.daysBaselinePerPeriod
      : Number(parsed.settings.daysBaselinePerPeriod) || merged.settings.daysBaselinePerPeriod;
    merged.settings.settingsCollapsed = Object.prototype.hasOwnProperty.call(parsed.settings, 'settingsCollapsed')
      ? Boolean(parsed.settings.settingsCollapsed)
      : true;
    merged.settings.weeklyEntriesCollapsed = Object.prototype.hasOwnProperty.call(parsed.settings, 'weeklyEntriesCollapsed')
      ? Boolean(parsed.settings.weeklyEntriesCollapsed)
      : merged.settings.weeklyEntriesCollapsed;
    merged.settings.periodSummariesCollapsed = Object.prototype.hasOwnProperty.call(parsed.settings, 'periodSummariesCollapsed')
      ? Boolean(parsed.settings.periodSummariesCollapsed)
      : merged.settings.periodSummariesCollapsed;
    merged.settings.summaryCollapsed = Object.prototype.hasOwnProperty.call(parsed.settings, 'summaryCollapsed')
      ? Boolean(parsed.settings.summaryCollapsed)
      : merged.settings.summaryCollapsed;
    merged.settings.leaveTrackerCollapsed = Object.prototype.hasOwnProperty.call(parsed.settings, 'leaveTrackerCollapsed')
      ? Boolean(parsed.settings.leaveTrackerCollapsed)
      : merged.settings.leaveTrackerCollapsed;
    merged.settings.leavePeriodMode = parsed.settings.leavePeriodMode === 'rolling' ? 'rolling' : merged.settings.leavePeriodMode;
    merged.settings.rolling12WeekSummaryEnabled = Object.prototype.hasOwnProperty.call(parsed.settings, 'rolling12WeekSummaryEnabled')
      ? Boolean(parsed.settings.rolling12WeekSummaryEnabled)
      : merged.settings.rolling12WeekSummaryEnabled;
    merged.settings.manualRosterOnlyMode = Object.prototype.hasOwnProperty.call(parsed.settings, 'manualRosterOnlyMode')
      ? Boolean(parsed.settings.manualRosterOnlyMode)
      : merged.settings.manualRosterOnlyMode;
  }

  if (parsed.rosterTemplates && typeof parsed.rosterTemplates === 'object') {
    const normalizedSavedTemplates = {};
    Object.entries(parsed.rosterTemplates).forEach(([family, template]) => {
      const normalizedFamily = normalizeRosterFamily(family);
      if (normalizedFamily && template && typeof template === 'object') {
        normalizedSavedTemplates[normalizedFamily] = template;
      }
    });

    merged.rosterTemplates = {
      ...defaultTemplates,
      ...normalizedSavedTemplates
    };
  } else {
    merged.rosterTemplates = defaultTemplates;
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
  const options = [];
  const defaults = getDefaultRosterTemplates();
  const allTemplates = {
    ...defaults,
    ...(state.rosterTemplates || {})
  };

  Object.keys(allTemplates).forEach(familyKey => {
    const family = normalizeRosterFamily(familyKey);
    const lines = allTemplates[familyKey]?.lines || {};
    Object.keys(lines).forEach(line => {
      options.push({
        family,
        line,
        label: formatRosterLineLabel(family, line),
        value: encodeTemplateRosterValue(family, line)
      });
    });
  });

  options.sort((a, b) => a.label.localeCompare(b.label));
  return options;
}

function encodeTemplateRosterValue(family, line) {
  return `${TEMPLATE_ROSTER_VALUE_PREFIX}${normalizeRosterFamily(family)}::${line}`;
}

function decodeTemplateRosterValue(value) {
  const raw = String(value || '');
  if (!raw.startsWith(TEMPLATE_ROSTER_VALUE_PREFIX)) return null;

  const payload = raw.slice(TEMPLATE_ROSTER_VALUE_PREFIX.length);
  const separatorIndex = payload.indexOf('::');
  if (separatorIndex <= 0) return null;

  const family = normalizeRosterFamily(payload.slice(0, separatorIndex));
  const line = payload.slice(separatorIndex + 2).trim();
  if (!family || !line) return null;
  return { family, line };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildRosterOptionsMarkup(options, selectedValue) {
  return options
    .map(option => `<option value="${escapeHtml(option.value)}" ${option.value === selectedValue ? 'selected' : ''}>${escapeHtml(option.label)}</option>`)
    .join('');
}

function filterRosterOptions(options, query, selectedValue) {
  const trimmedQuery = String(query || '').trim().toLowerCase();
  if (!trimmedQuery) return options;

  const selectedOption = options.find(option => option.value === selectedValue);
  const filtered = options.filter(option => option.label.toLowerCase().includes(trimmedQuery));
  if (selectedOption && !filtered.some(option => option.value === selectedOption.value)) {
    return [selectedOption, ...filtered];
  }
  return filtered;
}

function getRosterTemplateForFamily(family) {
  const defaults = getDefaultRosterTemplates();
  const normalizedFamily = normalizeRosterFamily(family);
  if (!normalizedFamily) return null;

  const allTemplates = {
    ...defaults,
    ...(state.rosterTemplates || {})
  };

  const matchedKey = Object.keys(allTemplates).find(key => normalizeRosterFamily(key) === normalizedFamily);
  return matchedKey ? allTemplates[matchedKey] : null;
}

function isTemplateRosterLine(rosterFamily, rosterLine) {
  const line = String(rosterLine || '').trim();
  if (!line) return false;
  const template = getRosterTemplateForFamily(rosterFamily);
  return Boolean(template?.lines && Object.prototype.hasOwnProperty.call(template.lines, line));
}

function getRosterWeekTemplate(family, rosterLine, weekStartDate) {
  const template = getRosterTemplateForFamily(family);
  if (!template || !rosterLine) return null;

  const lineTemplate = template.lines?.[rosterLine];
  if (!Array.isArray(lineTemplate) || !lineTemplate.length) return null;

  const anchorDate = template.anchorDate || state.settings.cycleStartDate || initialMonday;
  const cycleLengthWeeks = Number(template.cycleLengthWeeks) || lineTemplate.length;
  if (!cycleLengthWeeks) return null;

  const weeksFromAnchor = diffWeeks(anchorDate, weekStartDate);
  const cycleIndex = ((weeksFromAnchor % cycleLengthWeeks) + cycleLengthWeeks) % cycleLengthWeeks;
  return lineTemplate[cycleIndex] || null;
}

const ROSTER_LINE_PREFIX_BY_BOAT = {
  ALEXANDER: 'AL',
  BORROWDALE: 'BD',
  'LIZ ELLIS': 'LE',
  FISHBURN: 'FB',
  FRIENDSHIP: 'FS',
  'GOLDEN GROVE': 'GG',
  SCARBOROUGH: 'SB',
  SUPPLY: 'SU',
  PEMULWUY: 'PE',
  BUNGAREE: 'BU',
  'FRED HOLLOWS': 'FH',
  'VICTOR CHANG': 'VC',
  'MAY GIBBS': 'MG',
  'E C CRIB/RELIEF': 'ECR',
  FRESHWATER: 'FW',
  BALMORAL: 'BM',
  FAIRLIGHT: 'FL',
  CLONTARF: 'CO',
  'CRIB RELIEF': 'CR'
};

function getBoatPrefixCode(boatName) {
  const normalizedBoat = normalizeRosterFamily(boatName);
  if (!normalizedBoat) return '';
  if (ROSTER_LINE_PREFIX_BY_BOAT[normalizedBoat]) return ROSTER_LINE_PREFIX_BY_BOAT[normalizedBoat];

  const words = normalizedBoat.split(/[^A-Z0-9]+/).filter(Boolean);
  if (!words.length) return '';
  if (words.length === 1) return words[0].slice(0, 2);
  return words.slice(0, 2).map(word => word[0]).join('');
}

function formatRosterLineDesignator(boatName, rosterLine) {
  const line = String(rosterLine || '').trim();
  if (!line) return '';
  if (/^[A-Za-z]+\d/.test(line)) return line;

  const numericLineMatch = line.match(/^\d+(?:\.\d+)?$/);
  if (!numericLineMatch) return line;

  const prefix = getBoatPrefixCode(boatName);
  return prefix ? `${prefix}${line}` : line;
}

function formatRosterLineLabel(rosterFamily, rosterLine) {
  const family = normalizeRosterFamily(rosterFamily);
  const line = (rosterLine || '').trim();
  if (!line) return '';
  if (!isTemplateRosterLine(family, line)) return line;

  const displayFamily = toDisplayRosterFamily(family);
  if (!displayFamily) return line;

  const familyParts = displayFamily
    .split(' - ')
    .map(part => part.trim())
    .filter(Boolean);
  const boatName = familyParts[0] || displayFamily;
  const hasFreshwaterVariantDesignator = familyParts.some(part => /^FW\d+\.\d+$/i.test(part));
  const roleDesignators = familyParts.slice(1).map(designator => {
    if (designator.toUpperCase() === 'MASTERS/ENGINEERS') {
      return 'M/E';
    }
    if (designator.toUpperCase() === 'GPH') {
      return 'GPH';
    }
    if (boatName.toUpperCase() === 'FRESHWATER' && designator.toUpperCase() === 'COLLAROY') {
      return hasFreshwaterVariantDesignator ? 'GPH' : 'M/E';
    }
    return designator;
  });
  const displayLine = formatRosterLineDesignator(boatName, line);

  const lowerFamily = boatName.toLowerCase();
  const lowerLine = displayLine.toLowerCase();
  if (lowerLine.startsWith(lowerFamily + ' ')) return line;

  const roleSuffix = roleDesignators.length ? ` (${roleDesignators.join(' - ')})` : '';
  return `${boatName} ${displayLine}${roleSuffix}`;
}

function isKnownTemplateLine(rosterLine) {
  const line = String(rosterLine || '').trim();
  if (!line) return false;

  const defaults = getDefaultRosterTemplates();
  const allTemplates = {
    ...defaults,
    ...(state.rosterTemplates || {})
  };

  return Object.keys(allTemplates).some(family => isTemplateRosterLine(family, line));
}

function isManualRosterLine(rosterLine) {
  const line = typeof rosterLine === 'string' ? rosterLine.trim() : '';
  return Boolean(line) && !isKnownTemplateLine(line);
}

function deleteManualRosterLine(lineToDelete) {
  if (!isManualRosterLine(lineToDelete)) return;

  const weekMap = getWeeksMap();
  weekMap.forEach((week, startDate) => {
    if ((week.rosterLine || '').trim() === lineToDelete) {
      weekMap.set(startDate, normalizeWeek({
        ...week,
        rosterLine: '',
        manualRosterText: ''
      }));
    }
  });
  setWeeksMap(weekMap);
}

function autofillWeekFromRoster(startDate) {
  const weekMap = getWeeksMap();
  const week = weekMap.get(startDate) || createWeek(startDate);
  const family = normalizeRosterFamily(week.rosterFamily || DEFAULT_ROSTER_FAMILY);
  const rosterLine = week.rosterLine;
  const templateWeek = getRosterWeekTemplate(family, rosterLine, startDate);

  if (!templateWeek) return;

  week.rosterFamily = family;
  week.rosterLine = rosterLine;
  week.hoursWorked = templateWeek.hoursWorked || '';
  week.daysWorked = templateWeek.daysWorked;
  week.weekendWorked = typeof templateWeek.weekendWorked === 'boolean' ? templateWeek.weekendWorked : null;
  weekMap.set(startDate, normalizeWeek(week));
  setWeeksMap(weekMap);
}

function inclusiveDaysBetween(start, end) {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const diff = Math.round((e - s) / 86400000);
  return diff >= 0 ? diff + 1 : 0;
}

function getOverlapDaysInWindow(entryStartISO, entryEndISO, windowStartISO, windowEndISO) {
  if (!entryStartISO || !entryEndISO || !windowStartISO || !windowEndISO) return 0;

  const overlapStart = entryStartISO > windowStartISO ? entryStartISO : windowStartISO;
  const overlapEnd = entryEndISO < windowEndISO ? entryEndISO : windowEndISO;

  if (overlapEnd < overlapStart) return 0;
  return inclusiveDaysBetween(overlapStart, overlapEnd);
}

function getRolling12MonthStartISO(endISO) {
  const endDate = new Date(endISO + 'T00:00:00');
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);
  startDate.setDate(startDate.getDate() + 1);
  return formatLocalISO(startDate);
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

function getRolling12WeekStartDate(baseDate = new Date()) {
  const currentWeekMonday = getMondayISO(baseDate);
  return addDays(currentWeekMonday, -((WEEKS_IN_VIEW - 1) * 7));
}

function getRollingSummaryWeeks() {
  const weekMap = getWeeksMap();
  const rollingWindowStartDate = getRolling12WeekStartDate(new Date());

  return buildWindowWeeks(rollingWindowStartDate, weekMap).map((week, index) => ({
    ...week,
    absoluteIndex: index,
    period: Math.floor(index / WEEKS_PER_PERIOD) + 1,
    displayNumber: index + 1
  }));
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
  renderSummaryPanel();
  renderWeeklyEntriesPanel();
  renderPeriodSummariesPanel();
  renderLeaveTrackerPanel();
  renderWeeks();
  renderPeriodSummaries();
  renderCycleSummary();
  renderLeaveSection();
  saveState();
}

function renderSummaryPanel() {
  const summaryBody = document.getElementById('summaryBody');
  const summaryToggle = document.getElementById('summaryToggle');
  const summaryCollapseIndicator = document.getElementById('summaryCollapseIndicator');

  summaryBody?.classList.toggle('hidden', state.settings.summaryCollapsed);
  summaryToggle?.setAttribute('aria-expanded', String(!state.settings.summaryCollapsed));
  if (summaryCollapseIndicator) {
    summaryCollapseIndicator.textContent = state.settings.summaryCollapsed ? '[+]' : '[-]';
  }
}

function renderWeeklyEntriesPanel() {
  const weeklyEntriesBody = document.getElementById('weeklyEntriesBody');
  const weeklyEntriesToggle = document.getElementById('weeklyEntriesToggle');
  const weeklyEntriesCollapseIndicator = document.getElementById('weeklyEntriesCollapseIndicator');

  weeklyEntriesBody?.classList.toggle('hidden', state.settings.weeklyEntriesCollapsed);
  weeklyEntriesToggle?.setAttribute('aria-expanded', String(!state.settings.weeklyEntriesCollapsed));
  if (weeklyEntriesCollapseIndicator) {
    weeklyEntriesCollapseIndicator.textContent = state.settings.weeklyEntriesCollapsed ? '[+]' : '[-]';
  }
}

function renderPeriodSummariesPanel() {
  const periodSummariesBody = document.getElementById('periodSummariesBody');
  const periodSummariesToggle = document.getElementById('periodSummariesToggle');
  const periodSummariesCollapseIndicator = document.getElementById('periodSummariesCollapseIndicator');

  periodSummariesBody?.classList.toggle('hidden', state.settings.periodSummariesCollapsed);
  periodSummariesToggle?.setAttribute('aria-expanded', String(!state.settings.periodSummariesCollapsed));
  if (periodSummariesCollapseIndicator) {
    periodSummariesCollapseIndicator.textContent = state.settings.periodSummariesCollapsed ? '[+]' : '[-]';
  }
}

function renderLeaveTrackerPanel() {
  const leaveTrackerBody = document.getElementById('leaveTrackerBody');
  const leaveTrackerToggle = document.getElementById('leaveTrackerToggle');
  const leaveTrackerCollapseIndicator = document.getElementById('leaveTrackerCollapseIndicator');

  leaveTrackerBody?.classList.toggle('hidden', state.settings.leaveTrackerCollapsed);
  leaveTrackerToggle?.setAttribute('aria-expanded', String(!state.settings.leaveTrackerCollapsed));
  if (leaveTrackerCollapseIndicator) {
    leaveTrackerCollapseIndicator.textContent = state.settings.leaveTrackerCollapsed ? '[+]' : '[-]';
  }
}

function weekHasEnteredData(week) {
  if ((week.rosterLine || '').trim()) return true;
  if ((week.manualRosterText || '').trim()) return true;
  if (parseHoursToMinutes(week.hoursWorked) !== null) return true;
  if (String(week.daysWorked).trim() !== '') return true;
  return week.weekendWorked !== null;
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
  const manualRosterOnlyModeToggle = document.getElementById('manualRosterOnlyModeToggle');
  if (manualRosterOnlyModeToggle) {
    manualRosterOnlyModeToggle.checked = Boolean(state.settings.manualRosterOnlyMode);
  }
}

function renderWeeks() {
  const container = document.getElementById('weeksContainer');
  container.innerHTML = '';

  const visibleWeeks = getVisibleWeeks();
  const manualRosterOnlyMode = Boolean(state.settings.manualRosterOnlyMode);
  const templateRosterOptions = manualRosterOnlyMode ? [] : getRosterLineOptions();

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
    const summaryWeekend = week.weekendWorked === true ? 'Yes' : week.weekendWorked === false ? 'No' : 'Not set';
    const summaryRoster = week.rosterLine
      ? formatRosterLineLabel(week.rosterFamily, week.rosterLine)
      : 'Not set';
    const summaryStartDate = formatDisplayDate(week.startDate);
    const rosterLineValue = manualRosterOnlyMode
      ? (week.rosterLine || CUSTOM_ROSTER_LINE_VALUE)
      : isTemplateRosterLine(week.rosterFamily, week.rosterLine)
        ? encodeTemplateRosterValue(week.rosterFamily, week.rosterLine)
        : (week.rosterLine || CUSTOM_ROSTER_LINE_VALUE);
    const canDeleteManualLine = isManualRosterLine(week.rosterLine);
    const manualOptions = new Set(
      Object.values(state.timeline.weeksByStart || {})
        .map(item => (typeof item?.rosterLine === 'string' ? item.rosterLine.trim() : ''))
        .filter(line => line && isManualRosterLine(line))
    );
    if (isManualRosterLine(week.rosterLine)) {
      manualOptions.add(week.rosterLine.trim());
    }
    if (manualRosterOnlyMode && week.rosterLine && !manualOptions.has(week.rosterLine.trim())) {
      manualOptions.add(week.rosterLine.trim());
    }
    const manualRosterOptions = [...manualOptions].sort((left, right) => left.localeCompare(right));
    const rosterOptions = [
      {
        value: CUSTOM_ROSTER_LINE_VALUE,
        label: 'Select Roster'
      },
      ...templateRosterOptions,
      ...manualRosterOptions.map(line => ({
        value: line,
        label: line
      }))
    ];

    const card = document.createElement('div');
    const hasEnteredData = weekHasEnteredData(week);
    card.className = `week-card period-${week.period} ${hasEnteredData ? 'has-data' : ''} ${week.collapsed ? 'collapsed' : ''}`;
    card.innerHTML = `
      <button type="button" class="week-toggle" data-action="toggleWeek" data-start-date="${week.startDate}">
        <span class="week-title">Week ${week.displayNumber} · Period ${week.period} · ${summaryStartDate}</span>
        <span class="collapse-indicator" aria-hidden="true">${week.collapsed ? '[+]' : '[-]'}</span>
        <span class="week-summary">${summaryHours} hrs · ${summaryDays} days · Weekend: ${summaryWeekend}</span>
        <span class="week-roster-summary ${week.collapsed ? '' : 'hidden'}">Roster: ${escapeHtml(summaryRoster)}</span>
      </button>
      <div class="week-body ${week.collapsed ? 'hidden' : ''}">
        <div class="roster-selection-group">
          <div class="field roster-line-field">
            <label>Roster Line</label>
            <div class="roster-line-picker">
              <input
                type="text"
                class="roster-line-search ${manualRosterOnlyMode ? 'hidden' : ''}"
                data-action="rosterLineSearch"
                data-start-date="${week.startDate}"
                placeholder="Search boat or line..."
                aria-label="Search roster line"
              />
              <select data-field="rosterLine" data-start-date="${week.startDate}">
                ${buildRosterOptionsMarkup(rosterOptions, rosterLineValue)}
              </select>
              ${canDeleteManualLine ? `<button type="button" class="manual-line-delete" data-action="deleteManualRosterLine" data-start-date="${week.startDate}" aria-label="Delete manual roster line">x</button>` : ''}
            </div>
            <input type="hidden" data-field="rosterOptionsSource" data-start-date="${week.startDate}" value="${escapeHtml(JSON.stringify(rosterOptions))}" />
          </div>
          <div class="field roster-manual-field ${week.rosterLine ? 'hidden' : ''}">
            <label>Manual Roster Entry</label>
            <input type="text" placeholder="Enter roster line" value="${week.manualRosterText || ''}" data-field="manualRosterText" data-start-date="${week.startDate}" />
          </div>
        </div>
        <div class="entry-metrics-group">
          <div class="field entry-metrics-field">
            <label>Hours Worked ([h]:mm)</label>
            <input type="text" placeholder="43:00" value="${week.hoursWorked}" data-field="hoursWorked" data-start-date="${week.startDate}" />
          </div>
          <div class="field entry-metrics-field">
            <label>Days Worked</label>
            <input type="number" min="0" step="1" value="${week.daysWorked}" data-field="daysWorked" data-start-date="${week.startDate}" />
          </div>
          <div class="field entry-metrics-field">
            <label>Weekend Worked</label>
            <select data-field="weekendWorked" data-start-date="${week.startDate}">
              <option value="" ${week.weekendWorked === null ? 'selected' : ''}>Not set</option>
              <option value="true" ${week.weekendWorked === true ? 'selected' : ''}>Yes</option>
              <option value="false" ${week.weekendWorked === false ? 'selected' : ''}>No</option>
            </select>
          </div>
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

  container.querySelectorAll('[data-action="deleteManualRosterLine"]').forEach(el => {
    el.addEventListener('click', handleManualRosterLineDelete);
  });

  container.querySelectorAll('[data-action="rosterLineSearch"]').forEach(el => {
    el.addEventListener('input', handleRosterLineSearch);
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

function handleSummaryToggle() {
  state.settings.summaryCollapsed = !state.settings.summaryCollapsed;
  render();
}

function handleWeeklyEntriesToggle() {
  state.settings.weeklyEntriesCollapsed = !state.settings.weeklyEntriesCollapsed;
  render();
}

function handlePeriodSummariesToggle() {
  state.settings.periodSummariesCollapsed = !state.settings.periodSummariesCollapsed;
  render();
}

function handleLeaveTrackerToggle() {
  state.settings.leaveTrackerCollapsed = !state.settings.leaveTrackerCollapsed;
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
  } else if (field === 'rosterLine') {
    const manualRosterOnlyMode = Boolean(state.settings.manualRosterOnlyMode);
    const weekMap = getWeeksMap();
    const week = weekMap.get(startDate) || createWeek(startDate);

    if (value === CUSTOM_ROSTER_LINE_VALUE) {
      week.rosterLine = '';
      week.manualRosterText = '';
      weekMap.set(startDate, normalizeWeek(week));
      setWeeksMap(weekMap);
      render();
      return;
    }

    const parsedTemplateValue = manualRosterOnlyMode ? null : decodeTemplateRosterValue(value);
    if (parsedTemplateValue) {
      week.rosterFamily = parsedTemplateValue.family;
      week.rosterLine = parsedTemplateValue.line;
      week.manualRosterText = '';
      weekMap.set(startDate, normalizeWeek(week));
      setWeeksMap(weekMap);
      autofillWeekFromRoster(startDate);
      render();
      return;
    }

    week.rosterLine = value.trim();
    week.manualRosterText = '';
    weekMap.set(startDate, normalizeWeek(week));
    setWeeksMap(weekMap);
    render();
    return;
  }

  commitWeekField(startDate, field, value);
  render();
}

function handleManualRosterLineDelete(event) {
  const startDate = event.currentTarget.dataset.startDate;
  if (!startDate) return;

  const weekMap = getWeeksMap();
  const week = weekMap.get(startDate);
  const lineToDelete = (week?.rosterLine || '').trim();
  if (!isManualRosterLine(lineToDelete)) return;

  const confirmed = window.confirm(`Delete manual roster line "${lineToDelete}" from all weeks?`);
  if (!confirmed) return;

  deleteManualRosterLine(lineToDelete);
  render();
}

function handleRosterLineSearch(event) {
  const startDate = event.target.dataset.startDate;
  if (!startDate) return;

  const weekBody = event.target.closest('.week-body');
  const rosterSelect = weekBody?.querySelector(`select[data-field="rosterLine"][data-start-date="${startDate}"]`);
  const sourceInput = weekBody?.querySelector(`input[data-field="rosterOptionsSource"][data-start-date="${startDate}"]`);
  if (!rosterSelect || !sourceInput) return;

  try {
    const allOptions = JSON.parse(sourceInput.value);
    const selectedValue = rosterSelect.value;
    const filteredOptions = filterRosterOptions(allOptions, event.target.value, selectedValue);
    rosterSelect.innerHTML = buildRosterOptionsMarkup(filteredOptions, selectedValue);
  } catch {
    // Ignore malformed cached options and leave current select list unchanged.
  }
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
  const useRollingSummary = Boolean(state.settings.rolling12WeekSummaryEnabled);
  const summaryWeeks = useRollingSummary ? getRollingSummaryWeeks() : getVisibleWeeks();
  const s = computeTimelineSummary(summaryWeeks);
  const cycleStartDate = useRollingSummary ? getRolling12WeekStartDate(new Date()) : state.timeline.windowStartDate;
  const cycleEndDate = addDays(cycleStartDate, (WEEKS_IN_VIEW * 7) - 1);
  const todayISO = formatLocalISO(new Date());
  const cycleStatus = useRollingSummary
    ? 'Rolling Window'
    : todayISO < cycleStartDate
      ? 'Future'
      : todayISO > cycleEndDate
        ? 'Archived'
        : 'Current';
  const averageHoursOver = s.varianceMinutes > 0;
  const totalHoursVarianceMinutes = s.totalMinutes - s.baselineMinutesForRecordedWeeks;
  const totalHoursVarianceText = s.recordedWeeks ? minutesToVarianceLabel(totalHoursVarianceMinutes) : 'Awaiting data';
  const weekendsOver = s.weekendsWorked > 6;
  const periodAverageDaysMarkup = Array.from({ length: PERIODS_IN_VIEW }, (_, index) => {
    const periodSummary = computePeriodSummary(summaryWeeks, index);
    const content = periodSummary.completeForDays
      ? `${periodSummary.totalDays}`
      : 'N/A';
    const className = periodSummary.daysVariance !== null
      ? statusClass(periodSummary.daysVariance > 0)
      : '';

    return `<span class="${className}">${content}</span>`;
  }).join(' <span class="metric-separator">|</span> ');

  const rolling12WeekSummaryToggle = document.getElementById('rolling12WeekSummaryToggle');
  if (rolling12WeekSummaryToggle) {
    rolling12WeekSummaryToggle.checked = useRollingSummary;
  }

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
  const modeSelect = document.getElementById('leavePeriodMode');
  const yearFilterField = document.getElementById('leaveYearFilter')?.closest('.field');
  const yearFilterLabel = document.getElementById('leaveYearFilterLabel');
  const periodMeta = document.getElementById('leavePeriodMeta');
  const leaveDaysTotalLabel = document.getElementById('leaveDaysTotalLabel');
  const mode = state.settings.leavePeriodMode === 'rolling' ? 'rolling' : 'calendar';

  if (modeSelect) {
    modeSelect.value = mode;
  }

  const currentYear = Number(document.getElementById('leaveYearFilter').value) || new Date().getFullYear();
  document.getElementById('leaveYearFilter').value = currentYear;

  const todayISO = formatLocalISO(new Date());
  const rollingStartISO = getRolling12MonthStartISO(todayISO);
  const filtered = state.leaveEntries
    .map(entry => {
      const startISO = String(entry.startDate || '');
      const endISO = String(entry.endDate || entry.startDate || '');
      const overlapDays = getOverlapDaysInWindow(startISO, endISO, rollingStartISO, todayISO);

      return {
        ...entry,
        overlapDays
      };
    })
    .filter(entry => {
      const startISO = String(entry.startDate || '');
      if (!startISO) return false;

      if (mode === 'rolling') {
        return entry.overlapDays > 0;
      }

      return new Date(startISO + 'T00:00:00').getFullYear() === currentYear;
    });

  const leaveDaysTotal = filtered.reduce((sum, entry) => {
    if (mode === 'rolling') return sum + (entry.overlapDays || 0);
    return sum + (entry.totalDays || 0);
  }, 0);
  const missingCertificates = filtered.filter(entry => !entry.medicalCertificate).length;

  if (yearFilterField) {
    yearFilterField.classList.toggle('hidden', mode === 'rolling');
  }
  if (yearFilterLabel) {
    yearFilterLabel.textContent = mode === 'rolling' ? 'Calendar Year (hidden in rolling mode)' : 'Calendar Year';
  }
  if (leaveDaysTotalLabel) {
    leaveDaysTotalLabel.textContent = mode === 'rolling' ? 'Leave Days (Rolling 12 Months)' : 'Leave Days This Year';
  }
  if (periodMeta) {
    periodMeta.textContent = mode === 'rolling'
      ? `From ${formatDisplayDate(rollingStartISO)} to ${formatDisplayDate(todayISO)}`
      : `Viewing ${currentYear}`;
  }

  document.getElementById('leaveDaysTotal').textContent = leaveDaysTotal;
  document.getElementById('missingCertificates').textContent = missingCertificates;

  const list = document.getElementById('leaveList');
  list.innerHTML = filtered.length
    ? filtered.map(entry => `
        <div class="leave-item">
          <button type="button" class="leave-delete-button" data-action="deleteLeave" data-leave-id="${entry.id}">Delete</button>
          <strong>${formatDisplayDate(entry.startDate)} to ${formatDisplayDate(entry.endDate)}</strong>
          <div>${mode === 'rolling' ? `${entry.overlapDays} day(s) in period` : `${entry.totalDays} day(s)`}</div>
          <div>${entry.medicalCertificate ? 'Medical certificate provided' : 'No medical certificate'}</div>
        </div>
      `).join('')
    : `<p class="subtle">${mode === 'rolling' ? 'No leave records in the rolling 12-month period.' : 'No leave records for this year.'}</p>`;
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

document.getElementById('manualRosterOnlyModeToggle')?.addEventListener('change', e => {
  state.settings.manualRosterOnlyMode = Boolean(e.target.checked);
  render();
});

document.getElementById('settingsToggle')?.addEventListener('click', handleSettingsToggle);
document.getElementById('summaryToggle')?.addEventListener('click', handleSummaryToggle);
document.getElementById('weeklyEntriesToggle')?.addEventListener('click', handleWeeklyEntriesToggle);
document.getElementById('periodSummariesToggle')?.addEventListener('click', handlePeriodSummariesToggle);
document.getElementById('leaveTrackerToggle')?.addEventListener('click', handleLeaveTrackerToggle);
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
document.getElementById('rolling12WeekSummaryToggle')?.addEventListener('change', event => {
  state.settings.rolling12WeekSummaryEnabled = Boolean(event.target.checked);
  render();
});
document.getElementById('leavePeriodMode')?.addEventListener('change', event => {
  const selectedMode = event.target.value === 'rolling' ? 'rolling' : 'calendar';
  state.settings.leavePeriodMode = selectedMode;
  render();
});
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
