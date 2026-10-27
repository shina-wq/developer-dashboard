import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Folder containing index.html (the project root)
  root: '.',
  // Relative asset paths so dist/ works from any folder or sub-path
  base: './',
  plugins: [tailwindcss()],
  build: {
    // Production output folder, cleared before each build
    outDir: 'dist',
    emptyOutDir: true,
  },
});
