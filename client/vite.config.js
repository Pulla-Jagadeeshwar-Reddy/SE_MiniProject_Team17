import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, calls to /api are forwarded to the Express server on port 5050 (not 5000: macOS AirPlay uses it),
// so the client code always uses relative URLs like api.get('/questions').
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5050' },
  },
});
