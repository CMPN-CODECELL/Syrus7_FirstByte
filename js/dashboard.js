import { AuthService } from './services/auth.js';
import { StorageService } from './services/storage.js';
import { NotificationService } from './services/notifications.js';
import { UI } from './utils/ui.js';

export function initDashboard() {
  const user = AuthService.getCurrentUser();
  const welcomeGreetingEl = document.getElementById('dashboard-greeting');
  const studentNameEl = document.getElementById('dashboard-student-name');
  const userBranchEl = document.getElementById('dashboard-user-branch');

  if (welcomeGreetingEl) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    welcomeGreetingEl.textContent = `${greeting},`;
  }
  if (studentNameEl) {
    studentNameEl.textContent = `${user.name} 👋`;
  }
  if (userBranchEl) {
    userBranchEl.textContent = `${user.branch} · ${user.year} · ${user.college}`;
  }

  renderStats();
  renderUpcomingEvent();
  renderRecommendedPeers();
  renderActivityFeed();
}

function renderStats() {
  const students = StorageService.get(StorageService.KEYS.STUDENTS, []);
  const resources = StorageService.get(StorageService.KEYS.RESOURCES, []);
  const events = StorageService.get(StorageService.KEYS.EVENTS, []);
  const opportunities = StorageService.get(StorageService.KEYS.OPPORTUNITIES, []);

  const totalPeersEl = document.getElementById('stat-peers');
  const totalResourcesEl = document.getElementById('stat-resources');
  const totalEventsEl = document.getElementById('stat-events');
  const totalOppEl = document.getElementById('stat-opps');

  if (totalPeersEl) totalPeersEl.textContent = students.length;
  if (totalResourcesEl) totalResourcesEl.textContent = resources.length;
  if (totalEventsEl) totalEventsEl.textContent = events.length;
  if (totalOppEl) totalOppEl.textContent = opportunities.length;
}

function renderUpcomingEvent() {
  const events = StorageService.get(StorageService.KEYS.EVENTS, []);
  const container = document.getElementById('dashboard-event-spotlight');
  if (!container || !events.length) return;

  const nextEvent = events[0];
  container.innerHTML = `
    <div class="p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:to-slate-900/60 shadow-sm">
      <div class="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
        <span>Featured Campus Event</span>
        <span class="text-slate-500 font-normal">${nextEvent.date}</span>
      </div>
      <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
        ${nextEvent.title}
      </h3>
      <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
        ${nextEvent.description}
      </p>
      <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span class="text-slate-500 flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
          ${nextEvent.venue}
        </span>
        <a href="events.html?id=${nextEvent.id}" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors text-xs inline-block">
          View & Register →
        </a>
      </div>
    </div>
  `;
}

function renderRecommendedPeers() {
  const students = StorageService.get(StorageService.KEYS.STUDENTS, []);
  const currentUser = AuthService.getCurrentUser();
  const connections = StorageService.get(StorageService.KEYS.CONNECTIONS, {});
  const container = document.getElementById('dashboard-peer-list');
  if (!container) return;

  const peers = students.filter(s => s.id !== currentUser.id).slice(0, 3);
  container.innerHTML = peers.map(peer => {
    const status = connections[peer.id] || 'connect';
    return `
      <div class="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
        <div class="flex items-center gap-3 min-w-0">
          ${UI.renderAvatar(peer.name, "w-9 h-9 text-xs")}
          <div class="min-w-0">
            <h4 class="text-xs font-semibold text-slate-900 dark:text-white truncate">${peer.name}</h4>
            <p class="text-[11px] text-slate-500 truncate">${peer.branch} · ${peer.year}</p>
          </div>
        </div>
        <button class="peer-connect-btn px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors shrink-0 ml-2 ${
          status === 'connected'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            : status === 'requested'
            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100'
        }" data-peer-id="${peer.id}">
          ${status === 'connected' ? 'Connected' : status === 'requested' ? 'Pending' : 'Connect'}
        </button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.peer-connect-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const peerId = e.currentTarget.dataset.peerId;
      const curConnections = StorageService.get(StorageService.KEYS.CONNECTIONS, {});
      if (curConnections[peerId] === 'connected') {
        UI.showToast("Already connected with this student!", "info");
      } else if (curConnections[peerId] === 'requested') {
        curConnections[peerId] = 'connected';
        StorageService.set(StorageService.KEYS.CONNECTIONS, curConnections);
        UI.showToast("Connection confirmed!", "success");
        renderRecommendedPeers();
      } else {
        curConnections[peerId] = 'requested';
        StorageService.set(StorageService.KEYS.CONNECTIONS, curConnections);
        NotificationService.addNotification({
          type: "connection",
          title: "Connection Request Sent",
          message: "You sent a connection request to peer student.",
          link: "students.html"
        });
        UI.showToast("Connection request sent!", "success");
        renderRecommendedPeers();
      }
    });
  });
}

function renderActivityFeed() {
  const posts = StorageService.get(StorageService.KEYS.POSTS, []);
  const container = document.getElementById('dashboard-feed-container');
  if (!container) return;

  container.innerHTML = posts.slice(0, 3).map(post => `
    <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm" data-post-id="${post.id}">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          ${UI.renderAvatar(post.authorName, "w-8 h-8 text-xs")}
          <div>
            <span class="text-xs font-semibold text-slate-900 dark:text-white block">${post.authorName}</span>
            <span class="text-[11px] text-slate-500">${post.authorBranch} · ${post.timeAgo}</span>
          </div>
        </div>
        <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          ${post.type}
        </span>
      </div>
      
      <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        ${post.content}
      </p>

      <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div class="flex items-center gap-4">
          <button class="post-like-btn flex items-center gap-1.5 ${post.isLiked ? 'text-rose-600 font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'} transition-colors" data-id="${post.id}">
            <svg class="w-4 h-4 ${post.isLiked ? 'fill-rose-500 stroke-rose-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <span class="tabular-nums">${post.likes}</span>
          </button>
          <a href="feed.html" class="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span class="tabular-nums">${post.comments ? post.comments.length : 0}</span>
          </a>
        </div>

        <div class="flex items-center gap-2">
          <button class="post-share-btn text-slate-500 hover:text-slate-900 dark:hover:text-white p-1" title="Share" data-id="${post.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Feed action listeners
  container.querySelectorAll('.post-like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.currentTarget.dataset.id;
      const allPosts = StorageService.get(StorageService.KEYS.POSTS, []);
      const p = allPosts.find(item => item.id === postId);
      if (p) {
        p.isLiked = !p.isLiked;
        p.likes += p.isLiked ? 1 : -1;
        StorageService.set(StorageService.KEYS.POSTS, allPosts);
        renderActivityFeed();
      }
    });
  });

  container.querySelectorAll('.post-share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      UI.copyToClipboard(window.location.origin + "/feed.html", "Post link copied to clipboard!");
    });
  });
}
