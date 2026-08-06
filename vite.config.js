import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base is '/' because this deploys to a USER SITE repo (<username>.github.io),
// which serves from the domain root. A project repo would need '/<repo-name>/'
// here and a matching <BrowserRouter basename> in main.jsx.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: { outDir: 'dist' },
})
