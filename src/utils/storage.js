const PRESCRIPTIONS_KEY = 'dgc_prescriptions';
const DRUGS_KEY = 'dgc_saved_drugs';
const SETTINGS_KEY = 'dgc_settings';

export function savePrescription(prescription) {
  const list = getPrescriptions();
  const entry = {
    ...prescription,
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
  };
  list.unshift(entry);
  localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(list.slice(0, 200)));
  return entry;
}

export function getPrescriptions() {
  try {
    return JSON.parse(localStorage.getItem(PRESCRIPTIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function deletePrescription(id) {
  const list = getPrescriptions().filter(p => p.id !== id);
  localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(list));
}

export function getSavedDrugs() {
  try {
    return JSON.parse(localStorage.getItem(DRUGS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveDrug(name) {
  const list = getSavedDrugs();
  if (!list.includes(name)) {
    list.unshift(name);
    localStorage.setItem(DRUGS_KEY, JSON.stringify(list.slice(0, 100)));
  }
}

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
