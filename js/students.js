import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';
import { NotificationService } from './services/notifications.js';
import { UI } from './utils/ui.js';

export function initStudentsPage() {
  renderStudentDirectory();
  bindFilterListeners();
  checkUrlParamsForModal();
}

function bindFilterListeners() {
  const searchInput = document.getElementById('student-search');
  const branchFilter = document.getElementById('student-branch-filter');
  const yearFilter = document.getElementById('student-year-filter');
  const skillFilter = document.getElementById('student-skill-filter');
  const resetBtn = document.getElementById('student-filters-reset');

  const onFilterChange = () => renderStudentDirectory();

  if (searchInput) searchInput.addEventListener('input', onFilterChange);
  if (branchFilter) branchFilter.addEventListener('change', onFilterChange);
  if (yearFilter) yearFilter.addEventListener('change', onFilterChange);
  if (skillFilter) skillFilter.addEventListener('input', onFilterChange);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (branchFilter) branchFilter.value = 'all';
      if (yearFilter) yearFilter.value = 'all';
      if (skillFilter) skillFilter.value = '';
      renderStudentDirectory();
    });
  }
}

function renderStudentDirectory() {
  const container = document.getElementById('students-grid');
  const emptyState = document.getElementById('students-empty-state');
  const countBadge = document.getElementById('students-count-badge');
  if (!container) return;

  const students = StorageService.get(StorageService.KEYS.STUDENTS, []);
  const connections = StorageService.get(StorageService.KEYS.CONNECTIONS, {});
  const currentUser = AuthService.getCurrentUser();

  const searchVal = (document.getElementById('student-search')?.value || '').toLowerCase().trim();
  const branchVal = document.getElementById('student-branch-filter')?.value || 'all';
  const yearVal = document.getElementById('student-year-filter')?.value || 'all';
  const skillVal = (document.getElementById('student-skill-filter')?.value || '').toLowerCase().trim();

  const filtered = students.filter(student => {
    // Exclude current user from directory cards
    if (student.id === currentUser.id) return false;

    if (searchVal) {
      const matchName = student.name.toLowerCase().includes(searchVal);
      const matchBio = (student.bio || '').toLowerCase().includes(searchVal);
      const matchCollege = (student.college || '').toLowerCase().includes(searchVal);
      if (!matchName && !matchBio && !matchCollege) return false;
    }

    if (branchVal !== 'all') {
      if (!student.branch.toLowerCase().includes(branchVal.toLowerCase())) return false;
    }

    if (yearVal !== 'all') {
      if (!student.year.toLowerCase().includes(yearVal.toLowerCase())) return false;
    }

    if (skillVal) {
      const hasSkill = student.skills && student.skills.some(s => s.toLowerCase().includes(skillVal));
      const hasInterest = student.interests && student.interests.some(i => i.toLowerCase().includes(skillVal));
      if (!hasSkill && !hasInterest) return false;
    }

    return true;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} students found`;
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = filtered.map(student => {
    const connectionStatus = connections[student.id] || 'connect';
    return `
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between" data-student-id="${student.id}">
        <div>
          <!-- Header: Avatar + Name + Status -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              ${UI.renderAvatar(student.name, "w-11 h-11 text-sm")}
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  ${student.name}
                </h3>
                <p class="text-xs text-slate-500 leading-tight mt-0.5">
                  ${student.branch} · ${student.year}
                </p>
              </div>
            </div>
          </div>

          <!-- Status indicator -->
          <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span class="truncate">${student.status || 'Active Member'}</span>
          </div>

          <!-- Bio -->
          <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            ${student.bio || 'Exploring peer learning and tech collaboration on CampusOS.'}
          </p>

          <!-- Skills (clean unboxed text or interactive tags) -->
          <div class="mb-3">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">Skills</span>
            <div class="flex flex-wrap gap-1.5">
              ${student.skills.slice(0, 4).map(skill => `
                <span class="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                  ${skill}
                </span>
              `).join('')}
              ${student.skills.length > 4 ? `
                <span class="text-[11px] px-1.5 py-0.5 text-slate-400">+${student.skills.length - 4}</span>
              ` : ''}
            </div>
          </div>

          <!-- Interests -->
          <div class="mb-4">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">Interests</span>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
              ${student.interests.join(' · ')}
            </p>
          </div>
        </div>

        <!-- Card Action Buttons -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button class="view-profile-btn flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors" data-id="${student.id}">
            View Profile
          </button>
          <button class="connect-toggle-btn flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
            connectionStatus === 'connected'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : connectionStatus === 'requested'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }" data-id="${student.id}">
            ${
              connectionStatus === 'connected'
                ? '✓ Connected'
                : connectionStatus === 'requested'
                ? '⏳ Requested'
                : '+ Connect'
            }
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Bind Connect Button Lifecycle
  container.querySelectorAll('.connect-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.dataset.id;
      const curConnections = StorageService.get(StorageService.KEYS.CONNECTIONS, {});
      const student = students.find(s => s.id === studentId);
      const studentName = student ? student.name : 'student';

      if (curConnections[studentId] === 'connected') {
        if (confirm(`Remove connection with ${studentName}?`)) {
          delete curConnections[studentId];
          StorageService.set(StorageService.KEYS.CONNECTIONS, curConnections);
          UI.showToast(`Connection removed with ${studentName}`, 'info');
          renderStudentDirectory();
        }
      } else if (curConnections[studentId] === 'requested') {
        // Toggle to connected for immediate demo responsiveness
        curConnections[studentId] = 'connected';
        StorageService.set(StorageService.KEYS.CONNECTIONS, curConnections);
        NotificationService.addNotification({
          type: "connection",
          title: "Connection Accepted",
          message: `You are now connected with ${studentName}!`,
          link: "students.html"
        });
        UI.showToast(`Now connected with ${studentName}! 🎉`, 'success');
        renderStudentDirectory();
      } else {
        curConnections[studentId] = 'requested';
        StorageService.set(StorageService.KEYS.CONNECTIONS, curConnections);
        NotificationService.addNotification({
          type: "connection",
          title: "Connection Request Sent",
          message: `Request sent to ${studentName}.`,
          link: "students.html"
        });
        UI.showToast(`Connection request sent to ${studentName}!`, 'success');
        renderStudentDirectory();
      }
    });
  });

  // Bind View Profile Modal
  container.querySelectorAll('.view-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.dataset.id;
      openStudentModal(studentId);
    });
  });
}

function openStudentModal(studentId) {
  const students = StorageService.get(StorageService.KEYS.STUDENTS, []);
  const connections = StorageService.get(StorageService.KEYS.CONNECTIONS, {});
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  const modal = document.getElementById('student-modal');
  const modalContent = document.getElementById('student-modal-content');
  if (!modal || !modalContent) return;

  const connectionStatus = connections[student.id] || 'connect';

  modalContent.innerHTML = `
    <div class="relative p-6">
      <button id="modal-close-btn" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <!-- Profile Header -->
      <div class="flex items-center gap-4 mb-5">
        ${UI.renderAvatar(student.name, "w-16 h-16 text-xl")}
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">${student.name}</h2>
          <p class="text-xs text-blue-600 dark:text-blue-400 font-semibold">${student.branch} · ${student.year}</p>
          <p class="text-xs text-slate-500">${student.college}</p>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-5 text-center">
        <div>
          <span class="block text-base font-bold text-slate-900 dark:text-white tabular-nums">${student.resourcesCount || 0}</span>
          <span class="text-[10px] text-slate-500 uppercase font-medium">Resources</span>
        </div>
        <div>
          <span class="block text-base font-bold text-slate-900 dark:text-white tabular-nums">${student.eventsJoined || 0}</span>
          <span class="text-[10px] text-slate-500 uppercase font-medium">Events</span>
        </div>
        <div>
          <span class="block text-base font-bold text-slate-900 dark:text-white tabular-nums">${student.connectionsCount || 0}</span>
          <span class="text-[10px] text-slate-500 uppercase font-medium">Network</span>
        </div>
      </div>

      <!-- Bio -->
      <div class="mb-5">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">About</h4>
        <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${student.bio}</p>
      </div>

      <!-- Skills -->
      <div class="mb-5">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technical & Creative Skills</h4>
        <div class="flex flex-wrap gap-1.5">
          ${student.skills.map(s => `
            <span class="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
              ${s}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Send Direct Note Simulation -->
      <div class="mb-5 p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900">
        <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Send a quick campus message</h4>
        <div class="flex gap-2">
          <input id="quick-message-input" type="text" placeholder="Hey ${student.name.split(' ')[0]}, let's collaborate on..." class="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <button id="send-quick-message-btn" class="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap">
            Send
          </button>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div class="text-xs text-slate-500">
          Status: <span class="text-emerald-600 dark:text-emerald-400 font-medium">${student.status || 'Active'}</span>
        </div>
        <div class="flex items-center gap-2">
          <button id="modal-connect-btn" class="px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            connectionStatus === 'connected'
              ? 'bg-emerald-600 text-white'
              : connectionStatus === 'requested'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }">
            ${
              connectionStatus === 'connected'
                ? 'Connected'
                : connectionStatus === 'requested'
                ? 'Request Pending'
                : '+ Connect with ' + student.name.split(' ')[0]
            }
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('modal-close-btn')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  document.getElementById('send-quick-message-btn')?.addEventListener('click', () => {
    const input = document.getElementById('quick-message-input');
    if (!input || !input.value.trim()) {
      UI.showToast("Please enter a short message first", "warning");
      return;
    }
    UI.showToast(`Message sent to ${student.name}!`, "success");
    NotificationService.addNotification({
      type: "message",
      title: "Direct Note Sent",
      message: `Message sent to ${student.name}: "${input.value.trim()}"`,
      link: "students.html"
    });
    input.value = '';
  });

  document.getElementById('modal-connect-btn')?.addEventListener('click', () => {
    const curConnections = StorageService.get(StorageService.KEYS.CONNECTIONS, {});
    if (curConnections[student.id] === 'connected') {
      delete curConnections[student.id];
      StorageService.set(StorageService.KEYS.CONNECTIONS, curConnections);
      UI.showToast(`Disconnected with ${student.name}`, 'info');
    } else {
      curConnections[student.id] = 'connected';
      StorageService.set(StorageService.KEYS.CONNECTIONS, curConnections);
      UI.showToast(`Connected with ${student.name}!`, 'success');
    }
    openStudentModal(student.id);
    renderStudentDirectory();
  });
}

function checkUrlParamsForModal() {
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('id');
  if (studentId) {
    setTimeout(() => openStudentModal(studentId), 200);
  }
}
