import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';
import { NotificationService } from './services/notifications.js';
import { UI } from './utils/ui.js';

export function initFeedPage() {
  renderFeed();
  bindCreatePost();
  bindFilterTabs();
}

function bindFilterTabs() {
  const tabs = document.querySelectorAll('.feed-filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => {
        t.classList.remove('bg-blue-600', 'text-white');
        t.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      });
      e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      e.currentTarget.classList.add('bg-blue-600', 'text-white');
      renderFeed(e.currentTarget.dataset.type);
    });
  });
}

function renderFeed(filterType = 'all') {
  const container = document.getElementById('feed-posts-container');
  if (!container) return;

  const posts = StorageService.get(StorageService.KEYS.POSTS, []);
  const filtered = filterType === 'all' ? posts : posts.filter(p => p.type.toLowerCase() === filterType.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 p-8 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">No posts in this category yet</p>
        <p class="text-xs text-slate-400 mt-1">Be the first to share a discussion or update!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => `
    <article class="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all mb-4" data-post-id="${post.id}">
      
      <!-- Post Header -->
      <div class="flex items-center justify-between mb-3.5">
        <div class="flex items-center gap-3">
          ${UI.renderAvatar(post.authorName, "w-10 h-10 text-xs")}
          <div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-tight">${post.authorName}</h3>
            <p class="text-xs text-slate-500 leading-tight mt-0.5">${post.authorBranch} · ${post.timeAgo}</p>
          </div>
        </div>
        <span class="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
          ${post.type}
        </span>
      </div>

      <!-- Post Content -->
      <p class="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed mb-4 whitespace-pre-wrap">
        ${post.content}
      </p>

      <!-- Tags -->
      ${post.tags && post.tags.length ? `
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${post.tags.map(t => `<span class="text-[11px] text-blue-600 dark:text-blue-400 font-medium">#${t}</span>`).join(' ')}
        </div>
      ` : ''}

      <!-- Action Bar -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <div class="flex items-center gap-5">
          <button class="post-like-btn flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-rose-600 font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}" data-id="${post.id}">
            <svg class="w-4 h-4 ${post.isLiked ? 'fill-rose-500 stroke-rose-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <span class="tabular-nums">${post.likes}</span>
          </button>

          <button class="toggle-comments-btn flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" data-id="${post.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span class="tabular-nums">${post.comments ? post.comments.length : 0} Comments</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button class="post-save-btn p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" data-id="${post.id}" title="Save">
            <svg class="w-4 h-4 ${post.isSaved ? 'fill-blue-600 stroke-blue-600' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </button>
          <button class="post-share-btn p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" data-id="${post.id}" title="Share">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          </button>
        </div>
      </div>

      <!-- Comment Section Drawer -->
      <div id="comments-section-${post.id}" class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <!-- Comment List -->
        <div class="space-y-2">
          ${(post.comments || []).map(c => `
            <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-slate-900 dark:text-white">${c.author}</span>
                <span class="text-[10px] text-slate-400">${c.timeAgo || 'Just now'}</span>
              </div>
              <p class="text-slate-700 dark:text-slate-300 leading-snug">${c.text}</p>
            </div>
          `).join('')}
        </div>

        <!-- Add Comment Input -->
        <form class="add-comment-form flex gap-2 pt-1" data-post-id="${post.id}">
          <input type="text" placeholder="Write a constructive comment..." class="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" required />
          <button type="submit" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            Reply
          </button>
        </form>
      </div>

    </article>
  `).join('');

  // Likes
  container.querySelectorAll('.post-like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const allPosts = StorageService.get(StorageService.KEYS.POSTS, []);
      const p = allPosts.find(item => item.id === id);
      if (p) {
        p.isLiked = !p.isLiked;
        p.likes += p.isLiked ? 1 : -1;
        StorageService.set(StorageService.KEYS.POSTS, allPosts);
        renderFeed(filterType);
      }
    });
  });

  // Saves
  container.querySelectorAll('.post-save-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const allPosts = StorageService.get(StorageService.KEYS.POSTS, []);
      const p = allPosts.find(item => item.id === id);
      if (p) {
        p.isSaved = !p.isSaved;
        StorageService.set(StorageService.KEYS.POSTS, allPosts);
        UI.showToast(p.isSaved ? "Post saved to your bookmarks" : "Post removed from bookmarks", "info");
        renderFeed(filterType);
      }
    });
  });

  // Shares
  container.querySelectorAll('.post-share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      UI.copyToClipboard(window.location.origin + "/feed.html", "Post link copied to clipboard!");
    });
  });

  // Comment submit
  container.querySelectorAll('.add-comment-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const postId = e.currentTarget.dataset.postId;
      const input = e.currentTarget.querySelector('input');
      const text = input ? input.value.trim() : '';
      if (!text) return;

      const user = AuthService.getCurrentUser();
      const allPosts = StorageService.get(StorageService.KEYS.POSTS, []);
      const p = allPosts.find(item => item.id === postId);
      if (p) {
        if (!p.comments) p.comments = [];
        p.comments.push({
          id: "c-" + Date.now(),
          author: user.name,
          text,
          timeAgo: "Just now"
        });
        StorageService.set(StorageService.KEYS.POSTS, allPosts);
        UI.showToast("Comment posted!", "success");
        renderFeed(filterType);
      }
    });
  });
}

function bindCreatePost() {
  const triggerBtn = document.getElementById('open-create-post-btn');
  const modal = document.getElementById('create-post-modal');
  const closeBtn = document.getElementById('create-post-close-btn');
  const form = document.getElementById('create-post-form');

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('post-form-type')?.value;
      const content = document.getElementById('post-form-content')?.value.trim();
      const tagsRaw = document.getElementById('post-form-tags')?.value.trim();

      if (!content) {
        UI.showToast("Please enter some post content", "warning");
        return;
      }

      const user = AuthService.getCurrentUser();
      const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) : [];

      const newPost = {
        id: "post-" + Date.now(),
        authorName: user.name,
        authorBranch: `${user.branch}, ${user.year}`,
        type: type || "Discussion",
        timeAgo: "Just now",
        timestamp: Date.now(),
        content,
        tags,
        likes: 0,
        isLiked: false,
        isSaved: false,
        comments: []
      };

      const allPosts = StorageService.get(StorageService.KEYS.POSTS, []);
      allPosts.unshift(newPost);
      StorageService.set(StorageService.KEYS.POSTS, allPosts);

      NotificationService.addNotification({
        type: "feed",
        title: "Post Published",
        message: `Your campus ${type.toLowerCase()} post is now live.`,
        link: "feed.html"
      });

      UI.showToast("Post shared with campus! 🎉", "success");
      form.reset();
      modal.classList.add('hidden');
      renderFeed('all');
    });
  }
}
