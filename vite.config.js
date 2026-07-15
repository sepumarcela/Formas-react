import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function asyncStylesheets() {
  return {
    name: 'async-stylesheets',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g,
        '<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel=\'stylesheet\'">' +
          '<noscript><link rel="stylesheet" href="$1"></noscript>',
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), asyncStylesheets()],
})
