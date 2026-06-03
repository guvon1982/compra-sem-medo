import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Servidor de desenvolvimento
  server: {
    host: true, // expoe o servidor em todas as interfaces (necessario dentro do Docker)
    port: 5173,
    watch: {
      // polling resolve o problema de hot reload do Vite em volumes montados (Docker no Windows)
      usePolling: true,
    },
  },

  // Configuracao do Vitest (rodador de testes)
  test: {
    globals: true, // permite usar describe/it/expect sem importar
    environment: 'jsdom', // simula DOM para testar componentes React
    setupFiles: './src/test/setup.js', // arquivo executado antes de cada arquivo de teste
    css: true, // processa CSS dentro dos testes (necessario quando componente importa .css)
  },
})
