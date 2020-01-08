/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

require('@babel/register');

const yargs = require('yargs');
const util = require('util');
const chalk = require('chalk');
const runCheckArticles = require('./index');

const args = {
  options: {
    write: {
      alias: 'w',
      description: 'Caches api calls to make sequential runs faster',
      type: 'boolean',
    },
    single: {
      alias: 's',
      description: 'Check one article with given article id',
      type: 'number',
    },
    env: {
      alias: 'e',
      description: 'NDLA api enviornment',
      default: 'test',
      choices: ['test', 'staging', 'ff', 'prod'],
    },
    api: {
      alias: 'a',
      description: 'Api to query',
      default: 'article-api',
      choices: ['article-api', 'draft-api'],
    },
  },
  usage: 'Usage: $0 -w',
};

async function run(programArgs) {
  const { argv } = yargs(programArgs || process.argv.slice(2))
    .usage(args.usage)
    .help('h')
    .alias('help', 'h')
    .options(args.options)
    .wrap(Math.min(100, process.stdout.columns));

  if (argv.help) {
    yargs.showHelp();
    process.on('exit', () => process.exit(1));
  }

  try {
    await runCheckArticles(argv);
  } catch (e) {
    process.stdout.write(chalk.bold.red(util.format(e)));
    process.on('exit', () => process.exit(1));
  }
}
exports.run = run;
