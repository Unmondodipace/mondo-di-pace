const STORAGE_KEY = 'peace-thoughts';

const form = document.getElementById('peace-form');
const thoughtInput = document.getElementById('thought');
const nameInput = document.getElementById('name');
const countryInput = document.getElementById('country');
const acceptInput = document.getElementById('accept');
const formMessage = document.getElementById('form-message');
const messagesList = document.getElementById('messages-list');
const clearMessagesBtn = document.getElementById('clear-messages');

function getStoredMessages() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function renderMessages() {
  const messages = getStoredMessages();

  if (!messages.length) {
    messagesList.innerHTML = '<div class="empty-state">Nessun pensiero ancora condiviso. Sii il primo a lasciare un messaggio di pace.</div>';
    return;
  }

  messagesList.innerHTML = messages
    .slice()
    .reverse()
    .map(
      (item) => `
        <article class="message-card">
          <p>“${escapeHtml(item.thought)}”</p>
          <div class="message-meta">
            <span>${escapeHtml(item.name || 'Anonimo')}</span>
            <span>${escapeHtml(item.country || 'Paese non specificato')}</span>
          </div>
        </article>
      `
    )
    .join('');
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showMessage(text, type = 'success') {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const thought = thoughtInput.value.trim();
  const name = nameInput.value.trim();
  const country = countryInput.value;
  const accepted = acceptInput.checked;

  if (!thought) {
    showMessage('Scrivi un pensiero di pace prima di inviare.', 'error');
    thoughtInput.focus();
    return;
  }

  if (!accepted) {
    showMessage('Devi accettare il Patto delle Tre Azioni Buone.', 'error');
    acceptInput.focus();
    return;
  }

  const newEntry = {
    thought,
    name: name || 'Anonimo',
    country: country || 'Paese non specificato',
    createdAt: new Date().toISOString(),
  };

  const messages = getStoredMessages();
  messages.push(newEntry);
  saveMessages(messages);
  renderMessages();

  form.reset();
  showMessage('Pensiero inviato con successo. Grazie per aver contribuito alla pace.', 'success');
});

clearMessagesBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  renderMessages();
  showMessage('Tutti i pensieri sono stati cancellati.', 'success');
});

renderMessages();

const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

const softButton = document.querySelector('.soft-button');
softButton?.addEventListener('click', () => {
  document.getElementById('peace-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const stepChips = document.querySelectorAll('.step-chip');
stepChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('selected');
    chip.style.background = chip.classList.contains('selected')
      ? 'rgba(255,255,255,0.6)'
      : 'rgba(255,255,255,0.28)';
  });
});

const navBrand = document.querySelector('.nav-brand');
navBrand?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
