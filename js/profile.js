import { AuthService } from './services/auth.js';
import { StorageService } from './services/storage.js';
import { UI } from './utils/ui.js';

export function initProfilePage() {
  renderProfileHeader();
  renderProfileTabs();
  bindEditProfileModal();
}

function renderProfileHeader() {
  const user = AuthService.getCurrentUser();
  const avatarSlot = document.getElementById('profile-avatar-slot');
  const nameEl = document.getElementById('profile-name');
  const metaEl = document.getElementById('profile-meta');
  const collegeEl = document.getElementById('profile-college');
  const bioEl = document.getElementById('profile-bio');
  const skillsContainer = document.getElementById('profile-skills-list');
  const interestsContainer = document.getElementById('profile-interests-list');

  if (avatarSlot) {
    avatarSlot.innerHTML = UI.renderAvatar(user.name, "w-20 h-20 text-2xl");
  }
  if (nameEl) nameEl.textContent = user.name;
  if (metaEl) metaEl.textContent = `${user.branch} · ${user.year}`;
  if (collegeEl) collegeEl.textContent = user.college || 'Campus Institute of Technology';
  if (bioEl) bioEl.textContent = user.bio || 'Active learner exploring collaborative campus projects.';

  if (skillsContainer) {
    skillsContainer.innerHTML = (user.skills || []).map(s => `
      <span class="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
        ${s}
      </span>
    `).join('');
  }

  if (interestsContainer) {
    interestsContainer.innerHTML = (user.interests || []).map(i => `
      <span class="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
        ${i}
      </span>
    `).join('');
  }

  // Counts
  const resources = StorageService.get(StorageService.KEYS.RESOURCES, []);
  const myResources = resources.filter(r => r.uploadedBy === user.name);

  const events = StorageService.get(StorageService.KEYS.EVENTS, []);
  const myEvents = events.filter(e => e.registered);

  const connections = StorageService.get(StorageService.KEYS.CONNECTIONS, {});
  const connectedCount = Object.values(connections).filter(v => v === 'connected').length;

  document.getElementById('count-resources-shared').textContent = myResources.length;
  document.getElementById('count-events-joined').textContent = myEvents.length;
  document.getElementById('count-network-connections').textContent = connectedCount;
}

function renderProfileTabs() {
  const tabs = document.querySelectorAll('.profile-tab-btn');
  const contentArea = document.getElementById('profile-tab-content');
  if (!contentArea) return;

  const user = AuthService.getCurrentUser();

  const showTab = (tabName) => {
    tabs.forEach(t => {
      if (t.dataset.tab === tabName) {
        t.classList.add('border-blue-600', 'text-blue-600', 'dark:border-blue-400', 'dark:text-blue-400');
        t.classList.remove('border-transparent', 'text-slate-500');
      } else {
        t.classList.remove('border-blue-600', 'text-blue-600', 'dark:border-blue-400', 'dark:text-blue-400');
        t.classList.add('border-transparent', 'text-slate-500');
      }
    });

    if (tabName === 'resources') {
      const allRes = StorageService.get(StorageService.KEYS.RESOURCES, []);
      const myRes = allRes.filter(r => r.uploadedBy === user.name);
      if (myRes.length === 0) {
        contentArea.innerHTML = `<div class="p-8 text-center text-xs text-slate-400">You haven't uploaded any resources yet. Share study notes with peers in the <a href="learn.html" class="text-blue-600 underline">Learn tab</a>.</div>`;
        return;
      }
      contentArea.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${myRes.map(r => `
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span class="text-[10px] font-mono font-bold uppercase text-blue-600">${r.type} · ${r.subject}</span>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white mt-1">${r.title}</h4>
              <p class="text-[11px] text-slate-500 line-clamp-2 mt-1">${r.description}</p>
              <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex justify-between">
                <span>${r.downloads} downloads</span>
                <span>${r.upvotes} upvotes</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tabName === 'events') {
      const allEvents = StorageService.get(StorageService.KEYS.EVENTS, []);
      const myEvents = allEvents.filter(e => e.registered);
      if (myEvents.length === 0) {
        contentArea.innerHTML = `<div class="p-8 text-center text-xs text-slate-400">You haven't registered for any events yet. Check out <a href="events.html" class="text-blue-600 underline">Campus Events</a>!</div>`;
        return;
      }
      contentArea.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${myEvents.map(e => `
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span class="text-[10px] font-bold text-emerald-600 uppercase">Registered</span>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white mt-1">${e.title}</h4>
              <p class="text-[11px] text-slate-500 mt-1">${e.date} · ${e.venue}</p>
              <a href="events.html" class="text-xs text-blue-600 hover:underline mt-2 inline-block">View Event Details →</a>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tabName === 'connections') {
      const allStudents = StorageService.get(StorageService.KEYS.STUDENTS, []);
      const connections = StorageService.get(StorageService.KEYS.CONNECTIONS, {});
      const myPeers = allStudents.filter(s => connections[s.id] === 'connected');
      if (myPeers.length === 0) {
        contentArea.innerHTML = `<div class="p-8 text-center text-xs text-slate-400">You haven't connected with peers yet. Head over to <a href="students.html" class="text-blue-600 underline">Campus Connect</a> to discover students!</div>`;
        return;
      }
      contentArea.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          ${myPeers.map(s => `
            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
              <div class="flex items-center gap-3 min-w-0">
                ${UI.renderAvatar(s.name, "w-9 h-9 text-xs")}
                <div class="min-w-0">
                  <h4 class="text-xs font-semibold text-slate-900 dark:text-white truncate">${s.name}</h4>
                  <p class="text-[11px] text-slate-500 truncate">${s.branch}</p>
                </div>
              </div>
              <a href="students.html?id=${s.id}" class="text-xs text-blue-600 hover:underline shrink-0 ml-2">Profile</a>
            </div>
          `).join('')}
        </div>
      `;
    }
  };

  tabs.forEach(t => {
    t.addEventListener('click', () => showTab(t.dataset.tab));
  });

  // Default to resources
  showTab('resources');
}

function bindEditProfileModal() {
  const triggerBtn = document.getElementById('open-edit-profile-btn');
  const modal = document.getElementById('edit-profile-modal');
  const closeBtn = document.getElementById('edit-profile-close-btn');
  const form = document.getElementById('edit-profile-form');

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => {
      const user = AuthService.getCurrentUser();
      document.getElementById('edit-name').value = user.name || '';
      document.getElementById('edit-branch').value = user.branch || '';
      document.getElementById('edit-year').value = user.year || '';
      document.getElementById('edit-college').value = user.college || '';
      document.getElementById('edit-bio').value = user.bio || '';
      document.getElementById('edit-skills').value = (user.skills || []).join(', ');
      document.getElementById('edit-interests').value = (user.interests || []).join(', ');
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('edit-name')?.value.trim();
      const branch = document.getElementById('edit-branch')?.value.trim();
      const year = document.getElementById('edit-year')?.value.trim();
      const college = document.getElementById('edit-college')?.value.trim();
      const bio = document.getElementById('edit-bio')?.value.trim();
      const skillsRaw = document.getElementById('edit-skills')?.value.trim();
      const interestsRaw = document.getElementById('edit-interests')?.value.trim();

      const skills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
      const interests = interestsRaw ? interestsRaw.split(',').map(i => i.trim()).filter(Boolean) : [];

      AuthService.updateProfile({
        name,
        branch,
        year,
        college,
        bio,
        skills,
        interests
      });

      UI.showToast("Profile updated successfully! ✨", "success");
      modal.classList.add('hidden');
      renderProfileHeader();
    });
  }
}
