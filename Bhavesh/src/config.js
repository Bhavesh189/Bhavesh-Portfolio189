const env = import.meta.env || {};

export const telegram = {
  token: env.VITE_TELEGRAM_TOKEN || '8594030696:AAGFFxvCxU1uzJ9afY0rfWXuKPvyQjuaUA0',
  chatId: env.VITE_TELEGRAM_CHAT_ID || '7411383108',
};

export const accents = [
  { id: 'infinity', label: 'Infinity Gold', violet: '#dfa95c', violet2: '#f3d098', cyan: '#c5a880' },
  { id: 'emerald', label: 'Forest Emerald', violet: '#10b981', violet2: '#34d399', cyan: '#059669' },
  { id: 'ruby', label: 'Cyber Crimson', violet: '#ef4444', violet2: '#f87171', cyan: '#b91c1c' }
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
  const r = Math.random();
  let id = 'infinity';
  if (r < 0.50) {
    id = 'infinity';
  } else if (r < 0.75) {
    id = 'emerald';
  } else {
    id = 'ruby';
  }
  return applyAccent(id);
}
