import { AuthService } from '../services/auth.js';
import { NotificationService } from '../services/notifications.js';
import { ThemeService } from '../services/theme.js';
import { GlobalSearchService } from '../services/search.js';
import { UI } from '../utils/ui.js';

export class NavbarComponent {
  static render(activePage = '') {
    const user = AuthService.getCurrentUser();
    const isLoggedIn = AuthService.isLoggedIn();
    const unreadCount = NotificationService.getUnreadCount();
    const isDark = ThemeService.isDark();

    const navLinks = [
      { name: 'Dashboard', href: 'dashboard.html', key: 'dashboard' },
      { name: 'Connect', href: 'students.html', key: 'students' },
      { name: 'Learn', href: 'learn.html', key: 'learn' },
      { name: 'Exchange', href: 'exchange.html', key: 'exchange' },
      { name: 'Skills', href: 'skills.html', key: 'skills' },
      { name: 'Events', href: 'events.html', key: 'events' },
      { name: 'Opportunities', href: 'opportunities.html', key: 'opportunities' },
      { name: 'Feed', href: 'feed.html', key: 'feed' },
    ];

    const container = document.getElementById('navbar-container');
    if (!container) return;

    container.innerHTML = `
      <header class="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <!-- Zone 1: Single Wordmark Brand -->
          <div class="flex items-center gap-3 shrink-0">
            <a href="index.html" class="flex items-center gap-2.5 group focus:outline-none">
              <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-blue-700 transition-colors">
                C
              </div>
              <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                CampusOS
              </span>
            </a>
          </div>

          <!-- Zone 2: Navigation Links -->
          <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            ${navLinks.map(link => `
              <a href="${link.href}" 
                 class="transition-colors hover:text-blue-600 dark:hover:text-blue-400 py-1 ${activePage === link.key ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400' : ''}">
                ${link.name}
              </a>
            `).join('')}
          </nav>

          <!-- Zone 3: Actions (Search, Notif, Theme, User) -->
          <div class="flex items-center gap-2 sm:gap-3">
            
            <!-- Global Search Button -->
            <button id="nav-search-btn" class="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs" title="Search (Ctrl+K)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <span class="hidden md:inline font-mono text-[11px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">⌘K</span>
            </button>

            <!-- Theme Toggle Button -->
            <button id="nav-theme-btn" class="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle Theme">
              <svg id="theme-icon-sun" class="w-4 h-4 ${isDark ? 'hidden' : 'block'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <svg id="theme-icon-moon" class="w-4 h-4 ${isDark ? 'block' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            </button>

            <!-- Notifications Dropdown Trigger -->
            <div class="relative">
              <button id="nav-notif-btn" class="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative" title="Notifications">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                ${unreadCount > 0 ? `
                  <span id="nav-notif-badge" class="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                ` : ''}
              </button>

              <!-- Notifications Menu -->
              <div id="nav-notif-dropdown" class="hidden absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-down">
                <div class="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</span>
                    ${unreadCount > 0 ? `<span class="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 rounded">${unreadCount} new</span>` : ''}
                  </div>
                  <div class="flex items-center gap-2">
                    <button id="notif-mark-all-read" class="text-xs text-blue-600 hover:underline dark:text-blue-400">Mark read</button>
                    <span class="text-slate-300 dark:text-slate-700">·</span>
                    <button id="notif-clear-all" class="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">Clear</button>
                  </div>
                </div>
                <div id="notif-items-list" class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  <!-- Injected dynamically -->
                </div>
              </div>
            </div>

            <!-- User Profile Dropdown or Login button -->
            ${isLoggedIn ? `
              <div class="relative">
                <button id="nav-user-btn" class="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/30 transition-all focus:outline-none">
                  ${UI.renderAvatar(user.name, "w-8 h-8 text-xs")}
                  <span class="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    ${user.name.split(' ')[0]}
                  </span>
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>

                <!-- Profile Dropdown -->
                <div id="nav-user-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-slide-down">
                  <div class="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p class="text-xs font-semibold text-slate-900 dark:text-white truncate">${user.name}</p>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${user.email}</p>
                    <p class="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-medium">${user.branch}</p>
                  </div>
                  <div class="p-1">
                    <a href="profile.html" class="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      My Campus Profile
                    </a>
                    <a href="dashboard.html" class="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                      Dashboard
                    </a>
                    <button id="btn-switch-demo" class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                      Switch Demo User
                    </button>
                    <div class="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                    <button id="nav-logout-btn" class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ` : `
              <div class="flex items-center gap-2">
                <a href="login.html" class="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors">
                  Log In
                </a>
                <a href="signup.html" class="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap">
                  Join CampusOS
                </a>
              </div>
            `}

            <!-- Mobile Hamburger Toggle -->
            <button id="nav-mobile-toggle" class="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>

          </div>
        </div>

        <!-- Mobile Drawer Navigation -->
        <div id="nav-mobile-menu" class="hidden lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1">
          ${navLinks.map(link => `
            <a href="${link.href}" class="block px-3 py-2 rounded-lg text-sm font-medium ${activePage === link.key ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
              ${link.name}
            </a>
          `).join('')}
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="text-xs text-slate-500">Theme</span>
            <button id="mobile-theme-btn" class="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              Toggle Mode
            </button>
          </div>
        </div>
      </header>

      <!-- Global Search Modal -->
      <div id="search-modal" class="hidden fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 modal-backdrop bg-slate-900/60 flex justify-center items-start">
        <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
          <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input id="global-search-input" type="text" placeholder="Search students, notes, events, listings, opportunities..." class="w-full bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base" autofocus />
            <button id="search-modal-close" class="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white">ESC</button>
          </div>
          <div id="global-search-results" class="p-4 max-h-[65vh] overflow-y-auto space-y-4">
            <div class="text-center py-8 text-slate-400 text-sm">
              Type keywords like "Python", "Aarav", "Hackathon", "Notes", "Calculator" to search CampusOS.
            </div>
          </div>
          <div class="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>ProTip: Press <kbd class="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border text-slate-600 dark:text-slate-300">Ctrl</kbd> + <kbd class="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border text-slate-600 dark:text-slate-300">K</kbd> anywhere</span>
            <span>Team FirstByte · Syrus 7.0</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('nav-theme-btn');
    const mobileThemeBtn = document.getElementById('mobile-theme-btn');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    const handleThemeToggle = () => {
      const isDark = ThemeService.toggle();
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.classList.add('hidden');
          sunIcon.classList.remove('block');
          moonIcon.classList.remove('hidden');
          moonIcon.classList.add('block');
        } else {
          moonIcon.classList.add('hidden');
          moonIcon.classList.remove('block');
          sunIcon.classList.remove('hidden');
          sunIcon.classList.add('block');
        }
      }
    };

    if (themeBtn) themeBtn.addEventListener('click', handleThemeToggle);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', handleThemeToggle);

    // Mobile menu toggle
    const mobileToggle = document.getElementById('nav-mobile-toggle');
    const mobileMenu = document.getElementById('nav-mobile-menu');
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // User dropdown toggle
    const userBtn = document.getElementById('nav-user-btn');
    const userDropdown = document.getElementById('nav-user-dropdown');
    if (userBtn && userDropdown) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
        if (notifDropdown) notifDropdown.classList.add('hidden');
      });
    }

    // Notification dropdown toggle
    const notifBtn = document.getElementById('nav-notif-btn');
    const notifDropdown = document.getElementById('nav-notif-dropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
        if (userDropdown) userDropdown.classList.add('hidden');
        this.renderNotificationsList();
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      if (userDropdown) userDropdown.classList.add('hidden');
      if (notifDropdown) notifDropdown.classList.add('hidden');
    });

    // Mark all read & Clear notifications
    const markAllBtn = document.getElementById('notif-mark-all-read');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => {
        NotificationService.markAllAsRead();
        this.renderNotificationsList();
        const badge = document.getElementById('nav-notif-badge');
        if (badge) badge.remove();
        UI.showToast('All notifications marked as read', 'info');
      });
    }

    const clearAllBtn = document.getElementById('notif-clear-all');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        NotificationService.clearAll();
        this.renderNotificationsList();
        const badge = document.getElementById('nav-notif-badge');
        if (badge) badge.remove();
        UI.showToast('Notifications cleared', 'info');
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthService.logout();
      });
    }

    // Switch demo user
    const switchDemoBtn = document.getElementById('btn-switch-demo');
    if (switchDemoBtn) {
      switchDemoBtn.addEventListener('click', () => {
        const currentUser = AuthService.getCurrentUser();
        const nextId = currentUser.id === 'student-1' ? 'student-2' : 'student-1';
        const next = AuthService.loginAsDemo(nextId);
        UI.showToast(`Switched active demo profile to ${next.name}`, 'success');
        setTimeout(() => window.location.reload(), 400);
      });
    }

    // Search modal open/close
    const searchBtn = document.getElementById('nav-search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-modal-close');
    const searchInput = document.getElementById('global-search-input');

    const openSearch = () => {
      if (searchModal) {
        searchModal.classList.remove('hidden');
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
      }
    };

    const closeSearch = () => {
      if (searchModal) searchModal.classList.add('hidden');
    };

    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    if (searchModal) {
      searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearch();
      });
    }

    // Keyboard shortcut Cmd/Ctrl + K and Esc
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && searchModal && !searchModal.classList.contains('hidden')) {
        closeSearch();
      }
    });

    // Real-time search handler
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderSearchResults(e.target.value);
      });
    }
  }

  static renderNotificationsList() {
    const listEl = document.getElementById('notif-items-list');
    if (!listEl) return;

    const notifs = NotificationService.getAll();
    if (!notifs.length) {
      listEl.innerHTML = `
        <div class="p-6 text-center text-xs text-slate-400">
          No notifications yet. You're all caught up!
        </div>
      `;
      return;
    }

    listEl.innerHTML = notifs.map(n => `
      <div class="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-3 ${!n.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}">
        <div class="w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-600' : 'bg-transparent'}"></div>
        <div class="flex-1 min-w-0">
          <a href="${n.link}" class="block text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 truncate">
            ${n.title}
          </a>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">
            ${n.message}
          </p>
          <span class="text-[10px] text-slate-400 mt-1 block">${n.timeAgo}</span>
        </div>
      </div>
    `).join('');
  }

  static renderSearchResults(query) {
    const resultsEl = document.getElementById('global-search-results');
    if (!resultsEl) return;

    if (!query || !query.trim()) {
      resultsEl.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-sm">
          Type keywords like "Python", "Aarav", "Hackathon", "Notes", "Calculator" to search CampusOS.
        </div>
      `;
      return;
    }

    const res = GlobalSearchService.search(query);

    if (res.totalCount === 0) {
      resultsEl.innerHTML = `
        <div class="text-center py-12">
          <svg class="w-8 h-8 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-sm font-medium text-slate-700 dark:text-slate-300">No results found for "${UI.escapeHtml(query)}"</p>
          <p class="text-xs text-slate-400 mt-1">Try searching for other branches, subjects, or resource names.</p>
        </div>
      `;
      return;
    }

    let html = '';

    // Students
    if (res.students.length) {
      html += `
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Students</h4>
          <div class="space-y-1">
            ${res.students.map(s => `
              <a href="students.html?id=${s.id}" class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                ${UI.renderAvatar(s.name, "w-7 h-7 text-xs")}
                <div class="flex-1 min-w-0">
                  <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">${s.name}</span>
                  <span class="text-[11px] text-slate-500 block truncate">${s.branch} · ${s.year}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Resources
    if (res.resources.length) {
      html += `
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Academic Resources</h4>
          <div class="space-y-1">
            ${res.resources.map(r => `
              <a href="learn.html?id=${r.id}" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div class="min-w-0 pr-2">
                  <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">${r.title}</span>
                  <span class="text-[11px] text-slate-500">${r.subject}</span>
                </div>
                <span class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">${r.type}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Events
    if (res.events.length) {
      html += `
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Campus Events</h4>
          <div class="space-y-1">
            ${res.events.map(e => `
              <a href="events.html?id=${e.id}" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div class="min-w-0 pr-2">
                  <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">${e.title}</span>
                  <span class="text-[11px] text-slate-500">${e.date} · ${e.venue}</span>
                </div>
                <span class="text-[10px] text-blue-600 dark:text-blue-400 font-medium shrink-0">Details →</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Opportunities
    if (res.opportunities.length) {
      html += `
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Opportunities</h4>
          <div class="space-y-1">
            ${res.opportunities.map(o => `
              <a href="opportunities.html?id=${o.id}" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div class="min-w-0 pr-2">
                  <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">${o.title}</span>
                  <span class="text-[11px] text-slate-500">${o.organization}</span>
                </div>
                <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium shrink-0">${o.type}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Listings
    if (res.listings.length) {
      html += `
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Campus Exchange Items</h4>
          <div class="space-y-1">
            ${res.listings.map(l => `
              <a href="exchange.html?id=${l.id}" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div class="min-w-0 pr-2">
                  <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">${l.title}</span>
                  <span class="text-[11px] text-slate-500">${l.price} · ${l.condition}</span>
                </div>
                <span class="text-[10px] text-slate-400 shrink-0">View Item →</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    resultsEl.innerHTML = html;
  }
}
