import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';
import { NotificationService } from './services/notifications.js';
import { UI } from './utils/ui.js';

export function initEventsPage() {
  renderEvents();
  bindFilterListeners();
  bindCreateEventModal();
  checkUrlParams();
}

function bindFilterListeners() {
  const searchInput = document.getElementById('events-search');
  const categoryFilter = document.getElementById('events-category-filter');
  const resetBtn = document.getElementById('events-reset-btn');

  const onChange = () => renderEvents();

  if (searchInput) searchInput.addEventListener('input', onChange);
  if (categoryFilter) categoryFilter.addEventListener('change', onChange);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = 'all';
      renderEvents();
    });
  }
}

function renderEvents() {
  const container = document.getElementById('events-grid');
  const emptyState = document.getElementById('events-empty-state');
  const countBadge = document.getElementById('events-count-badge');
  if (!container) return;

  const events = StorageService.get(StorageService.KEYS.EVENTS, []);
  const searchVal = (document.getElementById('events-search')?.value || '').toLowerCase().trim();
  const categoryVal = document.getElementById('events-category-filter')?.value || 'all';

  const filtered = events.filter(e => {
    if (categoryVal !== 'all' && e.category !== categoryVal) return false;
    if (searchVal) {
      const matchTitle = e.title.toLowerCase().includes(searchVal);
      const matchVenue = e.venue.toLowerCase().includes(searchVal);
      const matchOrg = e.organizer.toLowerCase().includes(searchVal);
      const matchDesc = e.description.toLowerCase().includes(searchVal);
      if (!matchTitle && !matchVenue && !matchOrg && !matchDesc) return false;
    }
    return true;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} upcoming events`;
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = filtered.map(e => {
    const isRegistered = Boolean(e.registered);
    const categoryLabel =
      e.category === 'hackathon'
        ? '🏆 Flagship Hackathon'
        : e.category === 'workshop'
        ? '🛠️ Workshop'
        : e.category === 'meetup'
        ? '👥 Community Meet'
        : '🎙️ Tech Talk';

    return `
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between" data-event-id="${e.id}">
        <div>
          <!-- Header: Category + Seats remaining -->
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
              ${categoryLabel}
            </span>
            <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              ${e.remainingSeats} seats left
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2 line-clamp-2">
            ${e.title}
          </h3>

          <!-- Date & Venue info -->
          <div class="text-xs text-slate-600 dark:text-slate-400 space-y-1 mb-3">
            <div class="flex items-center gap-1.5 font-medium">
              <svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>${e.date} · ${e.time}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              <span class="truncate">${e.venue}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
            ${e.description}
          </p>

          <!-- Organizer tag -->
          <div class="text-[11px] text-slate-400 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            Organized by <strong class="text-slate-700 dark:text-slate-300 font-semibold">${e.organizer}</strong>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button class="event-interested-btn p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs tabular-nums" data-id="${e.id}" title="Interested">
            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            <span>${e.interestedCount || 0}</span>
          </button>

          <button class="event-share-btn p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors" data-id="${e.id}" title="Share event">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          </button>

          <button class="event-register-btn flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${
            isRegistered
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }" data-id="${e.id}">
            ${isRegistered ? '✓ Registered' : 'Register Now'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Register toggle
  container.querySelectorAll('.event-register-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const allEvents = StorageService.get(StorageService.KEYS.EVENTS, []);
      const item = allEvents.find(ev => ev.id === id);
      if (item) {
        item.registered = !item.registered;
        item.remainingSeats += item.registered ? -1 : 1;
        StorageService.set(StorageService.KEYS.EVENTS, allEvents);

        if (item.registered) {
          NotificationService.addNotification({
            type: "event",
            title: "Registration Confirmed!",
            message: `You are registered for "${item.title}". Check in at ${item.venue}.`,
            link: "events.html"
          });
          UI.showToast(`Registered for "${item.title}"! 🎉`, "success");
        } else {
          UI.showToast(`Cancelled registration for "${item.title}"`, "info");
        }
        renderEvents();
      }
    });
  });

  // Interested click
  container.querySelectorAll('.event-interested-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const allEvents = StorageService.get(StorageService.KEYS.EVENTS, []);
      const item = allEvents.find(ev => ev.id === id);
      if (item) {
        item.interestedCount = (item.interestedCount || 0) + 1;
        StorageService.set(StorageService.KEYS.EVENTS, allEvents);
        UI.showToast(`Marked as interested in ${item.title}!`, "info");
        renderEvents();
      }
    });
  });

  // Share
  container.querySelectorAll('.event-share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const url = `${window.location.origin}/events.html?id=${id}`;
      UI.copyToClipboard(url, "Event link copied!");
    });
  });
}

function bindCreateEventModal() {
  const triggerBtn = document.getElementById('open-create-event-btn');
  const modal = document.getElementById('create-event-modal');
  const closeBtn = document.getElementById('create-event-close-btn');
  const form = document.getElementById('create-event-form');

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('event-form-title')?.value.trim();
      const category = document.getElementById('event-form-category')?.value;
      const date = document.getElementById('event-form-date')?.value.trim();
      const time = document.getElementById('event-form-time')?.value.trim();
      const venue = document.getElementById('event-form-venue')?.value.trim();
      const seats = parseInt(document.getElementById('event-form-seats')?.value) || 50;
      const description = document.getElementById('event-form-description')?.value.trim();

      if (!title || !date || !time || !venue || !description) {
        UI.showToast("Please fill all required event details", "warning");
        return;
      }

      const currentUser = AuthService.getCurrentUser();
      const newEvent = {
        id: "evt-" + Date.now(),
        title,
        category: category || "workshop",
        date,
        time,
        venue,
        organizer: `${currentUser.name} & Student Chapter`,
        totalSeats: seats,
        remainingSeats: seats,
        registered: false,
        interestedCount: 1,
        description,
        tags: ["Campus", category]
      };

      const events = StorageService.get(StorageService.KEYS.EVENTS, []);
      events.unshift(newEvent);
      StorageService.set(StorageService.KEYS.EVENTS, events);

      NotificationService.addNotification({
        type: "event",
        title: "Event Published",
        message: `Your event "${title}" is now open for campus registrations.`,
        link: "events.html"
      });

      UI.showToast("Event created successfully! 🎉", "success");
      form.reset();
      modal.classList.add('hidden');
      renderEvents();
    });
  }
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    setTimeout(() => {
      const card = document.querySelector(`[data-event-id="${id}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('ring-2', 'ring-blue-500');
      }
    }, 300);
  }
}
