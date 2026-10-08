import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';
import { NotificationService } from './services/notifications.js';
import { UI } from './utils/ui.js';

export function initExchangePage() {
  renderListings();
  bindFilterListeners();
  bindCreateListingModal();
  checkUrlParams();
}

function bindFilterListeners() {
  const searchInput = document.getElementById('exchange-search');
  const categoryFilter = document.getElementById('exchange-category-filter');
  const dealFilter = document.getElementById('exchange-deal-filter');
  const resetBtn = document.getElementById('exchange-reset-btn');

  const onChange = () => renderListings();

  if (searchInput) searchInput.addEventListener('input', onChange);
  if (categoryFilter) categoryFilter.addEventListener('change', onChange);
  if (dealFilter) dealFilter.addEventListener('change', onChange);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = 'all';
      if (dealFilter) dealFilter.value = 'all';
      renderListings();
    });
  }
}

function renderListings() {
  const container = document.getElementById('listings-grid');
  const emptyState = document.getElementById('listings-empty-state');
  const countBadge = document.getElementById('listings-count-badge');
  if (!container) return;

  const listings = StorageService.get(StorageService.KEYS.LISTINGS, []);
  const searchVal = (document.getElementById('exchange-search')?.value || '').toLowerCase().trim();
  const categoryVal = document.getElementById('exchange-category-filter')?.value || 'all';
  const dealVal = document.getElementById('exchange-deal-filter')?.value || 'all';

  const filtered = listings.filter(item => {
    if (categoryVal !== 'all' && item.category !== categoryVal) return false;
    if (dealVal !== 'all' && item.dealType !== dealVal) return false;
    if (searchVal) {
      const matchTitle = item.title.toLowerCase().includes(searchVal);
      const matchDesc = item.description.toLowerCase().includes(searchVal);
      const matchOwner = item.ownerName.toLowerCase().includes(searchVal);
      if (!matchTitle && !matchDesc && !matchOwner) return false;
    }
    return true;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} active listings`;
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = filtered.map(item => {
    const isFree = item.dealType.includes("Free") || item.price.toLowerCase() === "free";
    return `
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between" data-listing-id="${item.id}">
        <div>
          <!-- Header: Category & Deal Type -->
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <span class="text-xs font-semibold ${isFree ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-blue-600 dark:text-blue-400'}">
              ${item.dealType}
            </span>
            <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              ${item.condition}
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1.5 line-clamp-2">
            ${item.title}
          </h3>

          <!-- Price Highlight -->
          <div class="text-base font-extrabold text-slate-900 dark:text-white tabular-nums mb-2">
            ${item.price}
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
            ${item.description}
          </p>

          <!-- Owner & Location info -->
          <div class="text-[11px] text-slate-400 dark:text-slate-500 space-y-1 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <span>Owner: ${item.ownerName}</span>
              <span>${item.dateListed}</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              <span class="truncate">${item.location}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2">
          <button class="save-listing-btn p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors" data-id="${item.id}" title="Save item">
            <svg class="w-4 h-4 ${item.saved ? 'fill-blue-600 stroke-blue-600' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </button>
          
          <button class="contact-owner-btn flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm" data-id="${item.id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            Contact Student
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Save toggle
  container.querySelectorAll('.save-listing-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const allListings = StorageService.get(StorageService.KEYS.LISTINGS, []);
      const item = allListings.find(l => l.id === id);
      if (item) {
        item.saved = !item.saved;
        StorageService.set(StorageService.KEYS.LISTINGS, allListings);
        UI.showToast(item.saved ? `Saved "${item.title.substring(0, 20)}..." to your bookmarks` : "Removed from bookmarks", "info");
        renderListings();
      }
    });
  });

  // Contact Owner
  container.querySelectorAll('.contact-owner-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      openContactModal(id);
    });
  });
}

function openContactModal(listingId) {
  const listings = StorageService.get(StorageService.KEYS.LISTINGS, []);
  const item = listings.find(l => l.id === listingId);
  if (!item) return;

  const modal = document.getElementById('contact-modal');
  const modalContent = document.getElementById('contact-modal-content');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="p-6">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">Campus Exchange Inquiry</span>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mt-0.5">${item.title}</h2>
          <p class="text-xs text-slate-500">Owner: ${item.ownerName} (${item.ownerBranch || 'CIT'})</p>
        </div>
        <button id="contact-modal-close" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4 text-xs space-y-1">
        <div><strong>Deal Terms:</strong> ${item.price} (${item.dealType})</div>
        <div><strong>Location:</strong> ${item.location}</div>
        <div><strong>Contact Email:</strong> <span class="font-mono text-blue-600">${item.ownerContact}</span></div>
      </div>

      <div class="mb-4">
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Direct Message</label>
        <textarea id="contact-message-body" rows="3" class="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">Hi ${item.ownerName}, I'm interested in your listing "${item.title}". Are you available to meet near ${item.location}?</textarea>
      </div>

      <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
        <button id="send-inquiry-btn" class="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
          Send Campus Inquiry
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('contact-modal-close')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  document.getElementById('send-inquiry-btn')?.addEventListener('click', () => {
    const msg = document.getElementById('contact-message-body')?.value.trim();
    if (!msg) {
      UI.showToast("Please include a brief message", "warning");
      return;
    }
    NotificationService.addNotification({
      type: "exchange",
      title: "Exchange Inquiry Sent",
      message: `You messaged ${item.ownerName} regarding "${item.title}".`,
      link: "exchange.html"
    });
    UI.showToast(`Inquiry sent to ${item.ownerName}! Check notifications.`, "success");
    modal.classList.add('hidden');
  });
}

function bindCreateListingModal() {
  const triggerBtn = document.getElementById('open-create-listing-btn');
  const modal = document.getElementById('create-listing-modal');
  const closeBtn = document.getElementById('create-listing-close-btn');
  const form = document.getElementById('create-listing-form');

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('listing-title')?.value.trim();
      const category = document.getElementById('listing-category')?.value;
      const condition = document.getElementById('listing-condition')?.value;
      const dealType = document.getElementById('listing-deal-type')?.value;
      const price = document.getElementById('listing-price')?.value.trim();
      const location = document.getElementById('listing-location')?.value.trim();
      const description = document.getElementById('listing-description')?.value.trim();

      if (!title || !price || !location || !description) {
        UI.showToast("Please fill all required listing fields", "warning");
        return;
      }

      const currentUser = AuthService.getCurrentUser();
      const newListing = {
        id: "list-" + Date.now(),
        title,
        category: category || "stationery",
        condition: condition || "Like New",
        dealType: dealType || "For Sale",
        price,
        ownerName: currentUser.name,
        ownerBranch: `${currentUser.branch}, ${currentUser.year}`,
        ownerContact: currentUser.email,
        description,
        location,
        dateListed: "Today",
        saved: false
      };

      const listings = StorageService.get(StorageService.KEYS.LISTINGS, []);
      listings.unshift(newListing);
      StorageService.set(StorageService.KEYS.LISTINGS, listings);

      NotificationService.addNotification({
        type: "exchange",
        title: "Listing Created",
        message: `Your listing "${title}" is now active in Campus Exchange.`,
        link: "exchange.html"
      });

      UI.showToast("Listing created successfully! 🎉", "success");
      form.reset();
      modal.classList.add('hidden');
      renderListings();
    });
  }
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    setTimeout(() => openContactModal(id), 250);
  }
}
