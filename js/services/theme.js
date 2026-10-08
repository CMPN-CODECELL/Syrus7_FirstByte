import { StorageService } from './storage.js';

export class ThemeService {
  static init() {
    const saved = localStorage.getItem(StorageService.KEYS.THEME);
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  static isDark() {
    return document.documentElement.classList.contains('dark');
  }

  static toggle() {
    const isCurrentlyDark = this.isDark();
    if (isCurrentlyDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(StorageService.KEYS.THEME, 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem(StorageService.KEYS.THEME, 'dark');
    }
    window.dispatchEvent(new CustomEvent('campusos_theme_change', { detail: { isDark: !isCurrentlyDark } }));
    return !isCurrentlyDark;
  }
}

// Auto-run theme immediately to prevent flashing
ThemeService.init();
