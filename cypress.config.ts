import { defineConfig } from 'cypress';
import { writeFileSync } from 'fs';
import { join } from 'path';

const fixturesDir = join(__dirname, '..', 'fixtures');

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'cypress/fixtures',
  video: true,
  videoUploadOnPasses: false,
  experimentalFetchPolyfill: true,
  viewportWidth: 1820,
  viewportHeight: 1280,
  projectId: 'snwitz',
  requestTimeout: 10000,
  defaultCommandTimeout: 10000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on) {
      return on('task', {
        writeFixtures: fixtures =>
          fixtures.map(fixture => {
            const fileName = join(fixturesDir, `${fixture.name}.json`);
            writeFileSync(fileName, fixture.json, 'utf-8');
            return fixture.json;
          }),
      });
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
