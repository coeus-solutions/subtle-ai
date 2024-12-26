import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envDir: '.',
    envPrefix: ['VITE_', 'VIDEO_ANALYZER_'],
    define: {
      'import.meta.env.VIDEO_ANALYZER_API_URL': JSON.stringify(env.VIDEO_ANALYZER_API_URL),
    },
  };
});