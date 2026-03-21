import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'child_process'
import fs from 'fs'

const branch = 'dev'
const packageJsonFile = fs.readFileSync('./package.json', 'utf-8')
const pkg = JSON.parse(packageJsonFile)
const d = new Date()
const buildDate = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}${String(d.getSeconds()).padStart(2,'0')}`

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __GIT_BRANCH__: JSON.stringify(branch),
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD_DATE__: JSON.stringify(buildDate)
  },
  server: {
    port: 12345,
  }
})
