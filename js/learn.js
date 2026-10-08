import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';
import { NotificationService } from './services/notifications.js';
import { UI } from './utils/ui.js';

export function initLearnPage() {
  renderResources();
  bindFilterListeners();
  bindUploadModal();
  checkUrlParams();
}

function bindFilterListeners() {
  const searchInput = document.getElementById('resource-search');
  const categoryFilter = document.getElementById('resource-category-filter');
  const sortFilter = document.getElementById('resource-sort-filter');
  const resetBtn = document.getElementById('resource-reset-btn');

  const onChange = () => renderResources();

  if (searchInput) searchInput.addEventListener('input', onChange);
  if (categoryFilter) categoryFilter.addEventListener('change', onChange);
  if (sortFilter) sortFilter.addEventListener('change', onChange);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = 'all';
      if (sortFilter) sortFilter.value = 'popular';
      renderResources();
    });
  }
}

function renderResources() {
  const container = document.getElementById('resources-grid');
  const emptyState = document.getElementById('resources-empty-state');
  const countBadge = document.getElementById('resources-count-badge');
  if (!container) return;

  const resources = StorageService.get(StorageService.KEYS.RESOURCES, []);
  const searchVal = (document.getElementById('resource-search')?.value || '').toLowerCase().trim();
  const categoryVal = document.getElementById('resource-category-filter')?.value || 'all';
  const sortVal = document.getElementById('resource-sort-filter')?.value || 'popular';

  let list = resources.filter(res => {
    if (categoryVal !== 'all' && res.category !== categoryVal) return false;
    if (searchVal) {
      const matchTitle = res.title.toLowerCase().includes(searchVal);
      const matchSub = res.subject.toLowerCase().includes(searchVal);
      const matchDesc = res.description.toLowerCase().includes(searchVal);
      const matchAuthor = res.uploadedBy.toLowerCase().includes(searchVal);
      if (!matchTitle && !matchSub && !matchDesc && !matchAuthor) return false;
    }
    return true;
  });

  // Sorting
  if (sortVal === 'popular') {
    list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
  } else if (sortVal === 'upvoted') {
    list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
  } else if (sortVal === 'recent') {
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  if (countBadge) {
    countBadge.textContent = `${list.length} academic items`;
  }

  if (list.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = list.map(res => {
    const typeBadgeColor =
      res.type === 'PDF'
        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
        : res.type === 'ZIP'
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        : res.type === 'CODE'
        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';

    return `
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between" data-resource-id="${res.id}">
        <div>
          <!-- Type and Subject -->
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <span class="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${typeBadgeColor}">
              ${res.type}
            </span>
            <span class="text-xs font-medium text-blue-600 dark:text-blue-400 truncate">
              ${res.subject}
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2 line-clamp-2">
            ${res.title}
          </h3>

          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
            ${res.description}
          </p>

          <!-- Uploader and File Stats -->
          <div class="text-[11px] text-slate-400 dark:text-slate-500 space-y-1 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <span>By ${res.uploadedBy}</span>
              <span>${res.date}</span>
            </div>
            <div class="flex items-center justify-between tabular-nums text-slate-500 dark:text-slate-400">
              <span>${res.fileSize || '3.5 MB'}</span>
              <span>${res.downloads} downloads · ${res.upvotes} upvotes</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button class="resource-upvote-btn p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs tabular-nums" data-id="${res.id}" title="Upvote">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
            <span>${res.upvotes}</span>
          </button>
          
          <button class="resource-view-btn flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm" data-id="${res.id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            View / Download
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Upvote handlers
  container.querySelectorAll('.resource-upvote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const resId = e.currentTarget.dataset.id;
      const allRes = StorageService.get(StorageService.KEYS.RESOURCES, []);
      const item = allRes.find(r => r.id === resId);
      if (item) {
        item.upvotes = (item.upvotes || 0) + 1;
        StorageService.set(StorageService.KEYS.RESOURCES, allRes);
        UI.showToast(`Upvoted "${item.title.substring(0, 25)}..."!`, 'success');
        renderResources();
      }
    });
  });

  // View modal handlers
  container.querySelectorAll('.resource-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const resId = e.currentTarget.dataset.id;
      openResourceModal(resId);
    });
  });
}

function openResourceModal(resId) {
  const resources = StorageService.get(StorageService.KEYS.RESOURCES, []);
  const res = resources.find(r => r.id === resId);
  if (!res) return;

  const modal = document.getElementById('resource-modal');
  const modalContent = document.getElementById('resource-modal-content');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="p-6">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <span class="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400">${res.category} · ${res.type}</span>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">${res.title}</h2>
          <p class="text-xs text-slate-500 mt-0.5">${res.subject} · Uploaded by ${res.uploadedBy} (${res.uploaderBranch || 'CIT Student'})</p>
        </div>
        <button id="res-modal-close" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Description -->
      <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        ${res.description}
      </div>

      <!-- Educational Content Preview Section -->
      <div class="mb-5">
        <div class="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
          <span>Resource Content Preview</span>
          <span class="font-mono text-[11px]">${res.fileSize || '3.5 MB'}</span>
        </div>
        <div class="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-64 leading-relaxed whitespace-pre-wrap border border-slate-800">
${res.contentPreview || 'Resource content verified and prepared for student download.'}
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span class="text-xs text-slate-500 tabular-nums">
          Downloaded ${res.downloads} times
        </span>
        <div class="flex items-center gap-2">
          <button id="modal-download-file-btn" class="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download Resource (${res.downloadFileName || 'file.txt'})
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('res-modal-close')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  document.getElementById('modal-download-file-btn')?.addEventListener('click', () => {
    // Increment download counter
    res.downloads = (res.downloads || 0) + 1;
    StorageService.set(StorageService.KEYS.RESOURCES, resources);

    const fileName = res.downloadFileName || `${res.title.replace(/\s+/g, '_')}.txt`;
    const previewContent = res.contentPreview || `${res.title}\n\n${res.description}\n\nDownloaded from CampusOS - Team FirstByte (Syrus 7.0)`;
    UI.downloadTextAsFile(fileName, previewContent);
    renderResources();
  });
}

function bindUploadModal() {
  const triggerBtn = document.getElementById('open-upload-modal-btn');
  const modal = document.getElementById('upload-resource-modal');
  const closeBtn = document.getElementById('upload-modal-close-btn');
  const form = document.getElementById('upload-resource-form');

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('upload-title')?.value.trim();
      const subject = document.getElementById('upload-subject')?.value.trim();
      const category = document.getElementById('upload-category')?.value;
      const type = document.getElementById('upload-type')?.value;
      const description = document.getElementById('upload-description')?.value.trim();
      const sampleNotes = document.getElementById('upload-notes-preview')?.value.trim();

      if (!title || !subject || !description) {
        UI.showToast("Please fill all required fields", "warning");
        return;
      }

      const currentUser = AuthService.getCurrentUser();
      const newResource = {
        id: "res-" + Date.now(),
        title,
        subject,
        category: category || "notes",
        type: type || "PDF",
        uploadedBy: currentUser.name,
        uploaderBranch: `${currentUser.branch}, ${currentUser.year}`,
        description,
        date: "Today",
        downloads: 0,
        upvotes: 1,
        fileSize: "2.4 MB",
        downloadFileName: `${title.replace(/\s+/g, '_')}.pdf`,
        contentPreview: sampleNotes || `# ${title}\nUploaded by ${currentUser.name}\n\n${description}`
      };

      const resources = StorageService.get(StorageService.KEYS.RESOURCES, []);
      resources.unshift(newResource);
      StorageService.set(StorageService.KEYS.RESOURCES, resources);

      // Add notification
      NotificationService.addNotification({
        type: "resource",
        title: "New Resource Shared",
        message: `Your resource "${title}" has been published to CampusOS repository.`,
        link: "learn.html"
      });

      UI.showToast("Resource uploaded successfully! 🎉", "success");
      form.reset();
      modal.classList.add('hidden');
      renderResources();
    });
  }
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    setTimeout(() => openResourceModal(id), 250);
  }
}
