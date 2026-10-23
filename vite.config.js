import { resolve } from 'path';
import { defineConfig } from 'vite';
import contactHandler from './api/contact.js';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: true,
  },
  plugins: [
    {
      name: 'api-contact-middleware',
      configureServer(server) {
        server.middlewares.use('/api/contact', (req, res) => {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            req.body = body;
            res.status = (code) => {
              res.statusCode = code;
              return {
                json: (data) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                },
              };
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            try {
              await contactHandler(req, res);
            } catch (err) {
              console.error('API Error in Vite middleware:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Erro interno no servidor de desenvolvimento.' }));
            }
          });
        });
      },
    },
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        servicos: resolve(__dirname, 'servicos.html'),
        propostaDeValor: resolve(__dirname, 'proposta-de-valor.html'),
        sobreNos: resolve(__dirname, 'sobre-nos.html'),
        contactos: resolve(__dirname, 'contactos.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
});

