import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: 'cypress/support/e2e.ts',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 10000,
        requestTimeout: 10000,
        responseTimeout: 30000,
        video: false,
        screenshotOnRunFailure: true,

        setupNodeEvents(_, config) {
            return config;
        },
    },

    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
        supportFile: 'cypress/support/component.ts',
        specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    },

    env: {
        apiUrl: process.env.CYPRESS_apiUrl || 'http://localhost:8000/api',
        testUserEmail: process.env.CYPRESS_testUserEmail || 'test@example.com',
        testUserPassword: process.env.CYPRESS_testUserPassword || '123123123',
    },
});
