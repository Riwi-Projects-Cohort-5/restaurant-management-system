import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true,
  },
})
