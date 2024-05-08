import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  // resolve: { preserveSymlinks: true },
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/v1': {
        // target: 'http://localhost:3000',
        target: 'https://twitter-x-clone-vnjo.onrender.com',
        changeOrigin: true
      }
    }
  }
})
