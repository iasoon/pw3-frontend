const config = {
    proxy: {
        '/api': {
            target: 'http://localhost:7412',
            rewrite: p => p.replace(/^\/api/, 'http://localhost:7412')
        }
    }
}

export default config;