import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import fs from 'fs';
import { visualizer } from 'rollup-plugin-visualizer';

const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));

export default defineConfig({
    plugins: [
        svgr({
            svgrOptions: {
                exportType: 'default',
                ref: true,
                svgo: false,
                titleProp: true,
            },
            include: '**/*.svg',
        }),
        react(),
        visualizer({ open: true, gzipSize: true, filename: 'stats.html' }),
    ],
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },
    assetsInclude: [],
    define: {
        __IS_DEV__: JSON.stringify(true),
        __API__: JSON.stringify('http://localhost:8000'),
        __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    server: {
        port: 3000,
        host: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: id => {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
});
