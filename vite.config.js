import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // three.js lives in the lazy Scene3D chunk (desktop only, loaded after first paint).
  build: { chunkSizeWarningLimit: 900 },
})
