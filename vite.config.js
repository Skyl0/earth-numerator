import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'child_process'

const branch = 'dev'
// const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __GIT_BRANCH__: JSON.stringify(branch)
  },
  server: {
    port: 12345,
  }
})
