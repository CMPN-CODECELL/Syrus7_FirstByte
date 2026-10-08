import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          login: path.resolve(__dirname, 'login.html'),
          signup: path.resolve(__dirname, 'signup.html'),
          dashboard: path.resolve(__dirname, 'dashboard.html'),
          students: path.resolve(__dirname, 'students.html'),
          learn: path.resolve(__dirname, 'learn.html'),
          exchange: path.resolve(__dirname, 'exchange.html'),
          skills: path.resolve(__dirname, 'skills.html'),
          events: path.resolve(__dirname, 'events.html'),
          opportunities: path.resolve(__dirname, 'opportunities.html'),
          feed: path.resolve(__dirname, 'feed.html'),
          profile: path.resolve(__dirname, 'profile.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

