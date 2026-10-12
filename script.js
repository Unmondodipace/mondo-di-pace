const SUPABASE_URL = 'https://uqhykpqxuybvtlnfikrx.supabase.co/rest/v1/;
const SUPABASE_KEY = "sb_publishable_xJbWH3ACgE644IkYjY9KvA_PEVdtPL2;

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const form = document.getElementById('peace-form');
const thoughtInput = document.getElementById('thought');
const nameInput = document.getElementById('name');
const countryInput = document.getElementById('country');
const acceptInput = document.getElementById('accept');
const formMessage = document.getElementById('form-message');
const messagesList = document.getElementById('messages-list');

function escapeHtml(input) {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showMessage(text, type = 'success') {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
}

function renderMessages(messages) {
  if (!messagesList) return;

  if (!messages.length) {
    messagesList.innerHTML =
      '<div class="empty-state">Nessun pensiero ancora condiviso. Sii il primo a lasciare un messaggio di pace.</div>';
    return;
  }

  messagesList.innerHTML = messages.map(item => `
    <article class="message-card">
      <p>“${escapeHtml(item.thought)}”</p>
      <div class="message-meta">
        <span>${escapeHtml(item.name || 'Anonimo')}</span>
        <span>${escapeHtml(item.country || 'Paese non specificato')}</span>
      </div>
    </article>
  `).join('');
}

async function loadMessages() {
  if (!messagesList) return;

  messagesList.innerHTML =
    '<div class="empty-state">Caricamento dei pensieri…</div>';

  const { data, error } = await supabaseClient
    .from('peace_messages')
    .select('id, thought, name, country, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Errore nel caricamento:', error);
    messagesList.innerHTML =
      '<div class="empty-state">Non riesco a caricare i pensieri. Riprova più tardi.</div>';
    return;
  }

  renderMessages(data || []);
}

if (form) {
  form.addEventListener('submit', async (event) => {
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

    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    const { error } = await supabaseClient
      .from('peace_messages')
      .insert([{
        thought,
        name: name || 'Anonimo',
        country: country || 'Paese non specificato'
      }]);

    if (submitButton) submitButton.disabled = false;

    if (error) {
      console.error('Errore durante l’invio:', error);
      showMessage('Non è stato possibile inviare il pensiero. Riprova.', 'error');
      return;
    }

    form.reset();
    showMessage('Pensiero inviato con successo. Grazie per aver contribuito alla pace.', 'success');
    await loadMessages();
  });
}

const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

const softButton = document.querySelector('.soft-button');
softButton?.addEventListener('click', () => {
  document.getElementById('peace-form')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
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

loadMessages();const clearButton = document.getElementById('clear-messages');

clearButton?.addEventListener('click', () => {
  if (messagesList) {
    messagesList.innerHTML =
      '<div class="empty-state">Nessun pensiero ancora condiviso. Sii il primo a lasciare un messaggio di pace.</div>';
  }
});
