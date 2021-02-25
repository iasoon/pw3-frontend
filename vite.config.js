const rust = require('vite-plugin-rust');
const path = require('path');
const config = {
    proxy: {
        '/websocket': {
            target: 'ws://localhost:7412',
            ws: true,
        },
        '/api': {
            target: 'http://localhost:7412',
            rewrite: p => p.replace(/^\/api/, 'http://localhost:7412'),
        }
    },
    optimizeDeps: {
        'exclude': 'planetwars-rs'
    },
    plugins: [
        rust({
            crates: {
                'planetwars-rs': './visualiser',
            }
        }),
    ],
    alias: {
        '/@/': path.resolve(__dirname, './src'),
    }
}

export default config;
