import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/VibeCodingSnippets/openclaw-skill-builder/',
  server: {
    port: 3000,
    open: true
  }
})
