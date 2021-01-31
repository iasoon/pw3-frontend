const rust = require('vite-plugin-rust');
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
    ]
}

export default config;
