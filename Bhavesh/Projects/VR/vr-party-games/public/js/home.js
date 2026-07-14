/**
 * Homepage - Server status check
 */
(function() {
  const socket = io({ transports: ['websocket'] });
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.getElementById('statusText');

  socket.on('connect', () => {
    statusDot.className = 'status-dot connected';
    statusText.textContent = 'Server Online';
    // Disconnect after status check to save resources
    setTimeout(() => socket.disconnect(), 2000);
  });

  socket.on('connect_error', () => {
    statusDot.className = 'status-dot disconnected';
    statusText.textContent = 'Server Offline';
  });
})();