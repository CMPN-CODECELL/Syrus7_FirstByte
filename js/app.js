import './services/theme.js';
import './services/storage.js';
import { NavbarComponent } from './components/navbar.js';
import { FooterComponent } from './components/footer.js';

export function initApp(activePage = '') {
  NavbarComponent.render(activePage);
  FooterComponent.render();
}

// Auto init if page specifies data-page
document.addEventListener('DOMContentLoaded', () => {
  const pageKey = document.body.dataset.page || '';
  initApp(pageKey);
});
