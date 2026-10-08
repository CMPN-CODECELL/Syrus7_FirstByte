import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';
import { NotificationService } from './services/notifications.js';
import { UI } from './utils/ui.js';

export function initOpportunitiesPage() {
  renderOpportunities();
  bindFilterListeners();
  checkUrlParams();
}

function bindFilterListeners() {
  const searchInput = document.getElementById('opp-search');
  const typeFilter = document.getElementById('opp-type-filter');
  const resetBtn = document.getElementById('opp-reset-btn');

  const onChange = () => renderOpportunities();

  if (searchInput) searchInput.addEventListener('input', onChange);
  if (typeFilter) typeFilter.addEventListener('change', onChange);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (typeFilter) typeFilter.value = 'all';
      renderOpportunities();
    });
  }
}

function renderOpportunities() {
  const container = document.getElementById('opportunities-grid');
  const emptyState = document.getElementById('opp-empty-state');
  const countBadge = document.getElementById('opp-count-badge');
  if (!container) return;

  const opportunities = StorageService.get(StorageService.KEYS.OPPORTUNITIES, []);
  const searchVal = (document.getElementById('opp-search')?.value || '').toLowerCase().trim();
  const typeVal = document.getElementById('opp-type-filter')?.value || 'all';

  const filtered = opportunities.filter(o => {
    if (typeVal !== 'all' && o.type !== typeVal) return false;
    if (searchVal) {
      const matchTitle = o.title.toLowerCase().includes(searchVal);
      const matchOrg = o.organization.toLowerCase().includes(searchVal);
      const matchDesc = o.description.toLowerCase().includes(searchVal);
      const matchElig = (o.eligibility || '').toLowerCase().includes(searchVal);
      if (!matchTitle && !matchOrg && !matchDesc && !matchElig) return false;
    }
    return true;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} active opportunities`;
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = filtered.map(o => {
    const isApplied = Boolean(o.applied);
    const typeLabel =
      o.type === 'internship'
        ? '💼 Internship'
        : o.type === 'research'
        ? '🔬 Research Assistantship'
        : o.type === 'scholarship'
        ? '🎓 Scholarship / Grant'
        : o.type === 'hackathon'
        ? '🏆 Hackathon Challenge'
        : '🚀 Program Cohort';

    return `
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between" data-opp-id="${o.id}">
        <div>
          <!-- Type + Deadline -->
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
              ${typeLabel}
            </span>
            <span class="text-[11px] text-slate-500 font-medium">
              Deadline: <strong class="text-slate-700 dark:text-slate-300">${o.deadline}</strong>
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug mb-1">
            ${o.title}
          </h3>

          <!-- Organization & Location -->
          <div class="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
            <span>${o.organization}</span>
            <span class="text-[11px]">${o.location || 'Campus / Hybrid'}</span>
          </div>

          <!-- Compensation / Stipend -->
          <div class="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl mb-3 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between border border-emerald-100 dark:border-emerald-900/60">
            <span>Funding / Stipend:</span>
            <span>${o.compensation || 'Disclosed upon selection'}</span>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-3">
            ${o.description}
          </p>

          <!-- Eligibility -->
          <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            Eligibility: <span class="text-slate-700 dark:text-slate-300 font-medium">${o.eligibility}</span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-2">
          <button class="save-opp-btn p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors" data-id="${o.id}" title="Save opportunity">
            <svg class="w-4 h-4 ${o.saved ? 'fill-blue-600 stroke-blue-600' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </button>

          <button class="view-opp-btn py-1.5 px-3 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors" data-id="${o.id}">
            Details
          </button>

          <button class="apply-opp-btn flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${
            isApplied
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }" data-id="${o.id}">
            ${isApplied ? '✓ Application Submitted' : 'Apply Now →'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Save toggle
  container.querySelectorAll('.save-opp-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const all = StorageService.get(StorageService.KEYS.OPPORTUNITIES, []);
      const item = all.find(o => o.id === id);
      if (item) {
        item.saved = !item.saved;
        StorageService.set(StorageService.KEYS.OPPORTUNITIES, all);
        UI.showToast(item.saved ? `Saved "${item.title.substring(0, 20)}..."` : "Removed from bookmarks", "info");
        renderOpportunities();
      }
    });
  });

  // View Details
  container.querySelectorAll('.view-opp-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      openOppModal(id);
    });
  });

  // Apply Now
  container.querySelectorAll('.apply-opp-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      openApplyModal(id);
    });
  });
}

function openOppModal(oppId) {
  const all = StorageService.get(StorageService.KEYS.OPPORTUNITIES, []);
  const item = all.find(o => o.id === oppId);
  if (!item) return;

  const modal = document.getElementById('opp-modal');
  const modalContent = document.getElementById('opp-modal-content');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="p-6">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">${item.type}</span>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mt-1">${item.title}</h2>
          <p class="text-xs text-slate-500">${item.organization} · ${item.location}</p>
        </div>
        <button id="opp-modal-close" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4 text-xs">
        <div><strong>Deadline:</strong> ${item.deadline}</div>
        <div><strong>Compensation:</strong> ${item.compensation}</div>
      </div>

      <div class="mb-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Overview</h4>
        <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${item.description}</p>
      </div>

      <div class="mb-5">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Eligibility Criteria</h4>
        <p class="text-xs text-slate-700 dark:text-slate-300">${item.eligibility}</p>
      </div>

      <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
        <button id="modal-apply-btn" class="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
          ${item.applied ? 'Update Application' : 'Proceed to Application'}
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('opp-modal-close')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  document.getElementById('modal-apply-btn')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    openApplyModal(item.id);
  });
}

function openApplyModal(oppId) {
  const all = StorageService.get(StorageService.KEYS.OPPORTUNITIES, []);
  const item = all.find(o => o.id === oppId);
  if (!item) return;

  const modal = document.getElementById('apply-modal');
  const modalContent = document.getElementById('apply-modal-content');
  if (!modal || !modalContent) return;

  const currentUser = AuthService.getCurrentUser();

  modalContent.innerHTML = `
    <div class="p-6">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">Campus Application</span>
          <h2 class="text-base font-bold text-slate-900 dark:text-white mt-0.5">${item.title}</h2>
          <p class="text-xs text-slate-500">${item.organization}</p>
        </div>
        <button id="apply-modal-close" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form id="apply-form" class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Applicant Name</label>
          <input type="text" value="${currentUser.name}" disabled class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Branch & Year</label>
            <input type="text" value="${currentUser.branch} · ${currentUser.year}" disabled class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Student Email</label>
            <input type="text" value="${currentUser.email}" disabled class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Portfolio / GitHub / Resume Link</label>
          <input id="apply-portfolio-link" type="url" placeholder="https://github.com/yourhandle or Google Drive Resume" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" required />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Brief Statement of Interest / Pitch (1-2 sentences)</label>
          <textarea id="apply-pitch-text" rows="3" class="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Why are you a good fit for this role?" required>I have relevant coursework in this domain and would love to contribute my practical problem-solving skills to the team.</textarea>
        </div>

        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button type="submit" class="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('apply-modal-close')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  document.getElementById('apply-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    item.applied = true;
    StorageService.set(StorageService.KEYS.OPPORTUNITIES, all);

    NotificationService.addNotification({
      type: "opportunity",
      title: "Application Received",
      message: `Your application for "${item.title}" at ${item.organization} has been submitted.`,
      link: "opportunities.html"
    });

    UI.showToast(`Application submitted to ${item.organization}! 🎉`, "success");
    modal.classList.add('hidden');
    renderOpportunities();
  });
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    setTimeout(() => openOppModal(id), 250);
  }
}
