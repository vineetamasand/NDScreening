// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://192.168.1.42:8000',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     }
//   }
// })

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',  // 👈 Allow external access
//     port: 5173        // 👈 (default Vite port)
//   }
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // 👈 expose dev server to LAN (mobile can access)
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // replace with your laptop's IP
        // target: 'http://192.168.68.100:8000', 
        changeOrigin: true,
      },
    },
  },
});
