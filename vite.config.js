import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Conjunto_Apis/', // <--- Añade esto exactamente igual al nombre de tu repo
  plugins: [
    react(),
    tailwindcss(),
  ],
})

