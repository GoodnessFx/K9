import { defineConfig } from 'vite'; 
 import react from '@vitejs/plugin-react'; 
 import path from 'path'; 
 
 export default defineConfig({ 
   plugins: [react()], 
   resolve: { 
     alias: { 
       '@':              path.resolve(__dirname, './src'), 
       '@/components':   path.resolve(__dirname, './src/components'), 
       '@/lib':          path.resolve(__dirname, './src/lib'), 
       '@/utils':        path.resolve(__dirname, './src/utils'), 
       '@/hooks':        path.resolve(__dirname, './src/hooks'), 
       '@/types':        path.resolve(__dirname, './src/types'), 
     }, 
   }, 
   server: { 
     port: 3000, 
     open: true, 
     host: true, 
   }, 
   build: { 
     outDir: 'dist', 
     sourcemap: false, 
     minify: 'esbuild', 
     target: 'es2015', 
     rollupOptions: { 
       output: { 
         manualChunks: { 
           'react-vendor':  ['react', 'react-dom'], 
           'router-vendor': ['react-router-dom'], 
           'ui-vendor':     ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select'], 
           'motion-vendor': ['framer-motion'], 
           'query-vendor':  ['@tanstack/react-query'], 
         }, 
       }, 
     }, 
     chunkSizeWarningLimit: 600, 
   }, 
   optimizeDeps: { 
     include: [ 
       'react', 'react-dom', 'react-router-dom', 
       'framer-motion', 'lucide-react', 'sonner', 
       '@tanstack/react-query', 
     ], 
   }, 
 }); 
