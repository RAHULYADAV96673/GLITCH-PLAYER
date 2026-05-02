 const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun',
                     'Jul','Aug','Sep','Oct','Nov','Dec'];

function updateClock() {
  const now     = new Date();
  let   hours   = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm    = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  const hStr = String(displayHours);
  const mStr = String(minutes).padStart(2, '0');

  const menubarEl = document.getElementById('menubar-clock');
  if (menubarEl) {
    const h24 = String(now.getHours()).padStart(2,'0');
    const m24 = String(minutes).padStart(2,'0');
    const dayShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()];
    menubarEl.textContent = `${dayShort} ${now.getDate()} ${MONTH_SHORT[now.getMonth()]}  ${h24}:${m24}`;
  }

  const deskHours = document.getElementById('desk-hours');
  const deskMins  = document.getElementById('desk-minutes');
  const deskAmpm  = document.getElementById('desk-ampm');
  const deskDate  = document.getElementById('desk-date');
  const secsFill  = document.getElementById('desk-seconds-fill');

  if (deskHours)  deskHours.textContent  = hStr;
  if (deskMins)   deskMins.textContent   = mStr;
  if (deskAmpm)   deskAmpm.textContent   = ampm;
  if (deskDate)   deskDate.textContent   =
    `${DAY_NAMES[now.getDay()]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}`;
  if (secsFill)   secsFill.style.width   = ((seconds / 60) * 100) + '%';
}

updateClock();
setInterval(updateClock, 1000);