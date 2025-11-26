import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wizar974/', // <--- AJOUTEZ CETTE LIGNE (Attention aux slashs)
})