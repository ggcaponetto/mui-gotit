import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// GH Pages serves the site at https://<user>.github.io/mui-gotit/
// so the asset base must be "/mui-gotit/". The CI workflow can override
// via VITE_BASE if the repo is ever renamed.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/mui-gotit/',
  plugins: [react()],
  resolve: {
    alias: {
      'mui-gotit': path.resolve(__dirname, '../src/index.ts'),
    },
  },
});
