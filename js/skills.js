import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';
import { NotificationService } from './services/notifications.js';
import { UI } from './utils/ui.js';

export function initSkillsPage() {
  renderSkills();
  bindFilterListeners();
  bindAddSkillModal();
}

function bindFilterListeners() {
  const searchInput = document.getElementById('skill-search');
  const typeFilter = document.getElementById('skill-type-filter');
  const categoryFilter = document.getElementById('skill-category-filter');
  const resetBtn = document.getElementById('skill-reset-btn');

  const onChange = () => renderSkills();

  if (searchInput) searchInput.addEventListener('input', onChange);
  if (typeFilter) typeFilter.addEventListener('change', onChange);
  if (categoryFilter) categoryFilter.addEventListener('change', onChange);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (typeFilter) typeFilter.value = 'all';
      if (categoryFilter) categoryFilter.value = 'all';
      renderSkills();
    });
  }
}

function renderSkills() {
  const container = document.getElementById('skills-grid');
  const emptyState = document.getElementById('skills-empty-state');
  const countBadge = document.getElementById('skills-count-badge');
  if (!container) return;

  const skills = StorageService.get(StorageService.KEYS.SKILLS, []);
  const searchVal = (document.getElementById('skill-search')?.value || '').toLowerCase().trim();
  const typeVal = document.getElementById('skill-type-filter')?.value || 'all';
  const categoryVal = document.getElementById('skill-category-filter')?.value || 'all';

  const filtered = skills.filter(item => {
    if (typeVal !== 'all' && item.type !== typeVal) return false;
    if (categoryVal !== 'all' && item.category !== categoryVal) return false;
    if (searchVal) {
      const matchSkill = item.skillName.toLowerCase().includes(searchVal);
      const matchDesc = item.description.toLowerCase().includes(searchVal);
      const matchStudent = item.studentName.toLowerCase().includes(searchVal);
      const matchEx = (item.exchangeFor || '').toLowerCase().includes(searchVal);
      if (!matchSkill && !matchDesc && !matchStudent && !matchEx) return false;
    }
    return true;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} exchange listings`;
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = filtered.map(item => {
    const isOffer = item.type === 'offer';
    return `
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between" data-skill-id="${item.id}">
        <div>
          <!-- Type Badge & Level -->
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider ${isOffer ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}">
              ${isOffer ? '⚡ Offering Skill' : '🎯 Seeking Skill'}
            </span>
            <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              ${item.level}
            </span>
          </div>

          <!-- Skill Title -->
          <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2">
            ${item.skillName}
          </h3>

          <!-- Student Info -->
          <div class="flex items-center gap-2 mb-3">
            ${UI.renderAvatar(item.studentName, "w-6 h-6 text-[10px]")}
            <span class="text-xs text-slate-600 dark:text-slate-300 font-medium">${item.studentName}</span>
            <span class="text-[11px] text-slate-400 truncate">· ${item.studentBranch}</span>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            ${item.description}
          </p>

          <!-- Reciprocal Exchange Details -->
          <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
            <div>
              <strong class="text-slate-700 dark:text-slate-300">Looking for:</strong> 
              <span class="text-slate-600 dark:text-slate-400">${item.exchangeFor}</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <svg class="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>${item.availability}</span>
            </div>
            <div class="text-[11px] text-slate-400">
              Mode: <span class="text-slate-600 dark:text-slate-300 font-medium">${item.mode || 'Library / Virtual'}</span>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button class="request-exchange-btn w-full py-2 px-3 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm" data-id="${item.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            Propose Skill Swap
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Request exchange click
  container.querySelectorAll('.request-exchange-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      openSkillRequestModal(id);
    });
  });
}

function openSkillRequestModal(skillId) {
  const skills = StorageService.get(StorageService.KEYS.SKILLS, []);
  const item = skills.find(s => s.id === skillId);
  if (!item) return;

  const modal = document.getElementById('skill-request-modal');
  const modalContent = document.getElementById('skill-request-modal-content');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="p-6">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">Peer Skill Exchange</span>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Swap with ${item.studentName}</h2>
          <p class="text-xs text-slate-500">Skill: ${item.skillName}</p>
        </div>
        <button id="skill-req-close" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4 text-xs space-y-1">
        <div><strong>They can teach:</strong> ${item.skillName} (${item.level})</div>
        <div><strong>They want in return:</strong> ${item.exchangeFor}</div>
        <div><strong>Their availability:</strong> ${item.availability}</div>
      </div>

      <div class="space-y-3 mb-5">
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">What skill can you offer?</label>
          <input id="propose-skill-input" type="text" placeholder="e.g., I can teach you Figma / DSA in C++ / Calculus..." class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Proposed study time & venue</label>
          <input id="propose-slot-input" type="text" placeholder="e.g., Saturdays 4 PM at Library Ground Floor" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>

      <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
        <button id="send-swap-proposal-btn" class="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
          Send Skill Swap Proposal
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('skill-req-close')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  document.getElementById('send-swap-proposal-btn')?.addEventListener('click', () => {
    const offer = document.getElementById('propose-skill-input')?.value.trim();
    const slot = document.getElementById('propose-slot-input')?.value.trim();

    if (!offer) {
      UI.showToast("Please state what skill you can offer in return", "warning");
      return;
    }

    NotificationService.addNotification({
      type: "skill",
      title: "Skill Swap Proposed",
      message: `You proposed a skill exchange with ${item.studentName}: "${item.skillName}" for "${offer}".`,
      link: "skills.html"
    });

    UI.showToast(`Swap proposal sent to ${item.studentName}! 🎉`, "success");
    modal.classList.add('hidden');
  });
}

function bindAddSkillModal() {
  const triggerBtn = document.getElementById('open-add-skill-modal-btn');
  const modal = document.getElementById('add-skill-modal');
  const closeBtn = document.getElementById('add-skill-close-btn');
  const form = document.getElementById('add-skill-form');

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('skill-form-type')?.value;
      const skillName = document.getElementById('skill-form-name')?.value.trim();
      const category = document.getElementById('skill-form-category')?.value;
      const level = document.getElementById('skill-form-level')?.value;
      const exchangeFor = document.getElementById('skill-form-exchange-for')?.value.trim();
      const availability = document.getElementById('skill-form-availability')?.value.trim();
      const mode = document.getElementById('skill-form-mode')?.value.trim();
      const description = document.getElementById('skill-form-description')?.value.trim();

      if (!skillName || !exchangeFor || !description) {
        UI.showToast("Please fill all required fields", "warning");
        return;
      }

      const currentUser = AuthService.getCurrentUser();
      const newSkill = {
        id: "skill-" + Date.now(),
        type: type || "offer",
        studentName: currentUser.name,
        studentBranch: `${currentUser.branch}, ${currentUser.year}`,
        skillName,
        category: category || "programming",
        level: level || "Intermediate",
        exchangeFor,
        availability: availability || "Flexible evenings",
        mode: mode || "Central Library / Discord",
        description
      };

      const skills = StorageService.get(StorageService.KEYS.SKILLS, []);
      skills.unshift(newSkill);
      StorageService.set(StorageService.KEYS.SKILLS, skills);

      NotificationService.addNotification({
        type: "skill",
        title: "Skill Listed",
        message: `Your skill listing "${skillName}" is now visible to peers.`,
        link: "skills.html"
      });

      UI.showToast("Skill listing created successfully! 🎉", "success");
      form.reset();
      modal.classList.add('hidden');
      renderSkills();
    });
  }
}
