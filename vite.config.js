import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: true,
  },
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

