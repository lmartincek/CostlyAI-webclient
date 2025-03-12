import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        //TODO - check later the mixin problem in components
        additionalData: `@import "/src/assets/styles/_variables.scss";`
      }
    }
  }
})
