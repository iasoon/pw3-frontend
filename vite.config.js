const path = require('path');
// import ViteRsw from 'vite-plugin-rsw';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
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
    plugins: [
        vue(),
        nodePolyfills(),
        // ViteRsw({
        //     crates: [
        //         'planetwars-rs',
        //     ]
        // }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }    
    }
})
