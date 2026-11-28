import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith('/api/tiktok-resolve') || req.url.startsWith('/api/stream-proxy'))) {
          try {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const pathname = urlObj.pathname;
            const query: Record<string, string> = {};
            urlObj.searchParams.forEach((val, key) => { query[key] = val; });

            (req as any).query = query;
            (res as any).status = function (code: number) {
              res.statusCode = code;
              return this;
            };
            (res as any).json = function (data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            (res as any).send = function (data: any) {
              res.end(data);
            };

            if (pathname === '/api/tiktok-resolve') {
              const { default: handler } = await import('./api/tiktok-resolve.js');
              await handler(req, res);
              return;
            } else if (pathname === '/api/stream-proxy') {
              const { default: handler } = await import('./api/stream-proxy.js');
              await handler(req, res);
              return;
            }
          } catch (err: any) {
            console.error('API middleware error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-lucide': ['lucide-react'],
          'vendor-hls': ['hls.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});

