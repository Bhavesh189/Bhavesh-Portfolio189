













const env = import.meta.env || {};

export const telegram = {
  token: env.VITE_TELEGRAM_TOKEN || '8594030696:AAGFFxvCxU1uzJ9afY0rfWXuKPvyQjuaUA0',
  chatId: env.VITE_TELEGRAM_CHAT_ID || '7411383108',
};


export const accents = [
  { id: 'nebula', label: 'Nebula', violet: '#7c5cff', violet2: '#9d7bff', cyan: '#29d3ee' },
  { id: 'matrix', label: 'Matrix', violet: '#22e39a', violet2: '#5cffb0', cyan: '#29d3ee' },
  { id: 'sunset', label: 'Sunset', violet: '#ff5c9d', violet2: '#ff85b6', cyan: '#ffb35c' },
  { id: 'ember', label: 'Ember', violet: '#ff6b4a', violet2: '#ff9a6a', cyan: '#ffcf5c' },
];

export function applyAccent(id) {
  const a = accents.find((x) => x.id === id) || accents[0];
  const root = document.documentElement;
  root.style.setProperty('--violet', a.violet);
  root.style.setProperty('--violet-2', a.violet2);
  root.style.setProperty('--cyan', a.cyan);
  try {
    localStorage.setItem('accent', a.id);
  } catch (e) {
    
  }
  return a.id;
}

export function initAccent() {
  let id = 'nebula';
  try {
    id = localStorage.getItem('accent') || 'nebula';
  } catch (e) {
    id = 'nebula';
  }
  return applyAccent(id);
}
