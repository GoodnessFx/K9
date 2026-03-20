import { defineConfig } from 'vite' 
import react from '@vitejs/plugin-react' 
import path from 'path' 
 
export default defineConfig({ 
  plugins: [react()], 
  resolve: { 
    alias: { 
      "@": path.resolve(__dirname, "./src"), 
      "@/components": path.resolve(__dirname, "./src/components"), 
      "@/lib": path.resolve(__dirname, "./src/lib"), 
      "@/utils": path.resolve(__dirname, "./src/utils"), 
      "@/hooks": path.resolve(__dirname, "./src/hooks"), 
      "@/types": path.resolve(__dirname, "./src/types"), 
    }, 
  }, 
  server: { port: 3000, open: true }, 
  build: { 
    outDir: 'dist', 
    sourcemap: true, 
    rollupOptions: { 
      output: { 
        manualChunks: { 
          'react-vendor':  ['react', 'react-dom'], 
          'three-vendor':  ['three', '@react-three/fiber', '@react-three/drei'], 
          'ui-vendor':     ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select'], 
          'motion-vendor': ['framer-motion'], 
          'chart-vendor':  ['recharts'], 
        } 
      } 
    } 
  }, 
  optimizeDeps: { 
    include: [ 
      'react', 'react-dom', 'three', 
      '@react-three/fiber', '@react-three/drei', 
      'framer-motion', 'lucide-react', 'recharts', 'sonner', 
      '@supabase/supabase-js', 'canvas-confetti', 
    ] 
  } 
}) 
