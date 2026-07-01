import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Project site at https://danieljacob95.github.io/Macrio-web/ — must match
  // the repo name exactly. Switch to '/' if a custom domain is set up later
  // (and add a public/CNAME file with the domain name).
  base: '/Macrio-web/',
})
