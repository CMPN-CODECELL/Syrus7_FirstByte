import { StorageService } from '../services/storage.js';
import { UI } from '../utils/ui.js';

export class FooterComponent {
  static render() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    container.innerHTML = `
      <footer class="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <!-- Col 1: Brand & Syrus 7.0 Info -->
            <div class="md:col-span-1 space-y-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">C</div>
                <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">CampusOS</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                A unified campus ecosystem for student connections, peer learning, resource exchange, and academic growth.
              </p>
              <div class="pt-2 text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
                <div>Team: <strong class="text-slate-700 dark:text-slate-300">FirstByte</strong></div>
                <div>Hackathon: <strong class="text-slate-700 dark:text-slate-300">Syrus 7.0</strong></div>
                <div>Problem Statement: <strong class="text-slate-700 dark:text-slate-300">PS-04</strong></div>
              </div>
            </div>

            <!-- Col 2: Core Modules -->
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Campus Modules</h4>
              <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><a href="dashboard.html" class="hover:text-blue-600 dark:hover:text-blue-400">Student Dashboard</a></li>
                <li><a href="students.html" class="hover:text-blue-600 dark:hover:text-blue-400">Campus Connect</a></li>
                <li><a href="learn.html" class="hover:text-blue-600 dark:hover:text-blue-400">Resource Repository</a></li>
                <li><a href="exchange.html" class="hover:text-blue-600 dark:hover:text-blue-400">Student Marketplace</a></li>
                <li><a href="skills.html" class="hover:text-blue-600 dark:hover:text-blue-400">Skill Exchange</a></li>
              </ul>
            </div>

            <!-- Col 3: Community & Engagement -->
            <div>
              <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Community</h4>
              <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><a href="events.html" class="hover:text-blue-600 dark:hover:text-blue-400">Campus Events</a></li>
                <li><a href="opportunities.html" class="hover:text-blue-600 dark:hover:text-blue-400">Internships & Grants</a></li>
                <li><a href="feed.html" class="hover:text-blue-600 dark:hover:text-blue-400">Discussion Feed</a></li>
                <li><a href="profile.html" class="hover:text-blue-600 dark:hover:text-blue-400">Student Profile</a></li>
              </ul>
            </div>

            <!-- Col 4: Judge Demo Controls -->
            <div class="space-y-3">
              <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-2">Hackathon Evaluation</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Full-stack frontend MVP running client-side with LocalStorage persistence. Ready for GitHub Pages deployment.
              </p>
              <div class="pt-1 flex flex-col gap-2">
                <button id="footer-reset-data-btn" class="w-full text-center px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  ↺ Reset Demo Data
                </button>
              </div>
            </div>

          </div>

          <!-- Bottom hairline -->
          <div class="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 CampusOS · Built with passion by FirstByte for Syrus 7.0.</p>
            <div class="flex items-center gap-4">
              <span>Connect → Learn → Exchange → Grow</span>
            </div>
          </div>
        </div>
      </footer>
    `;

    const resetBtn = document.getElementById('footer-reset-data-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset all LocalStorage data to the initial demo state?")) {
          StorageService.resetToDefaults();
          UI.showToast("Demo data reset to factory initial state", "info");
        }
      });
    }
  }
}
