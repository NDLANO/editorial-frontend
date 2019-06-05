// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const fs = require('fs');
const path = require('path');

const fixturesDir = path.join(__dirname, '..', 'fixtures');

module.exports = on => {
  on('task', {
    writeFixtures: fixtures =>
      fixtures.map(fixture => {
        const fileName = path.join(fixturesDir, `${fixture.name}.json`);
        fs.writeFileSync(fileName, fixture.json, 'utf-8');
        return fixture.json;
      }),
  });
};
