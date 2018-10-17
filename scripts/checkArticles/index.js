/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const jsdom = require('jsdom');
const chalk = require('chalk');
const queryString = require('query-string');
const fetch = require('isomorphic-fetch');
const fs = require('fs');
const Differ = require('diff-match-patch');
const mkdirp = require('mkdirp');
const { getNdlaApiUrl } = require('../../src/config');
const {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} = require('../../src/util/articleContentConverter');
const { resolveJsonOrRejectWithError } = require('../../src/util/apiHelpers');

const dom = new jsdom.JSDOM('<!DOCTYPE html></html>');
const differ = new Differ();

global.window = dom.window;
global.document = window.document;
global.navigator = window.navigator;
global.NodeFilter = window.NodeFilter;

const { fragment } = jsdom.JSDOM;

let token = '';
/* eslint no-console: 0 */
/* eslint prefer-template: 0 */
/* eslint no-await-in-loop: 0 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchSystemAccessToken() {
  token = await fetch(`https://ndla.eu.auth0.com/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.NDLA_EDITORIAL_CLIENT_ID,
      client_secret: process.env.NDLA_EDITORIAL_CLIENT_SECRET,
      audience: 'ndla_system',
    }),
    json: true,
  }).then(resolveJsonOrRejectWithError);
}

async function fetchArticles(url, query) {
  const result = await fetch(`${url}?${queryString.stringify(query)}`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  })
    .then(resolveJsonOrRejectWithError)
    .catch(err =>
      console.log(
        `${chalk.red(`Search with query page ${query.page} is failing.`)}`,
        err,
      ),
    );
  return result;
}

async function fetchArticle(url, id) {
  await sleep(100);
  let result;
  result = await fetch(`${url}${id}`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  })
    .then(resolveJsonOrRejectWithError)
    .catch(async err => {
      if (err.status === 401) {
        await fetchSystemAccessToken();
        result = await fetchArticle(id);
      } else {
        console.log(`${chalk.red(`Article with id ${id} is failing`)}`, err);
      }
    });
  return result;
}

async function fetchAllArticles(url) {
  const query = {
    page: 1,
    'page-size': 100,
  };
  const firstResult = await fetchArticles(url, query);

  const numberOfPages = Math.ceil(
    firstResult.totalCount / firstResult.pageSize,
  );
  const requests = [];
  const estimatedTime = Math.ceil(
    (numberOfPages * query['page-size'] * 0.5) / 60,
  );

  console.log(
    `Fetching ${numberOfPages} pages with a page size of ${
      query['page-size']
    }. Estimated time is ${estimatedTime} minutes`,
  );

  for (let i = 1; i < numberOfPages + 1; i += 1) {
    requests.push(fetchArticles(url, { ...query, page: i }));
    await sleep(500);

    console.log(
      `${chalk.green(
        `Fetching page ${i} with page size ${query['page-size']}`,
      )}`,
    );
  }

  const articleIds = [];
  const results = await Promise.all(requests);
  results.forEach(result => {
    const articles = result ? result.results.map(article => article.id) : [];
    articleIds.push(...articles);
  });
  return articleIds;
}

function diffHTML(oldHtml, newHtml) {
  const diffs = differ.diff_main(oldHtml, newHtml);
  differ.diff_cleanupSemantic(diffs);
  let diffString = '';
  const lengthDifference = Math.abs(newHtml.length - oldHtml.length);

  let shouldWarn = lengthDifference > 50;

  diffs.forEach(diff => {
    // green for additions, red for deletions
    // grey for common parts
    const [result, value] = diff;
    if (result === 1) {
      diffString += `${chalk.green(value)}`;
    } else if (result === -1) {
      diffString += `${chalk.red(value)}`;
      shouldWarn = true;
    } else {
      diffString += value;
    }
  });
  return { diff: diffString, warn: shouldWarn };
}

function testArticle(article) {
  if (!article) {
    console.log(`${chalk.yellow(`No article!`)}`);
    return { hasError: true };
  }

  try {
    const converted = learningResourceContentToEditorValue(
      article.content.content,
      fragment,
    );

    const diffObject = diffHTML(
      article.content.content,
      learningResourceContentToHTML(converted),
    );

    console.log(
      `${chalk.green(
        `Article with id ${
          article.id
        } was sucessfully converted to slate and back to HTML.`,
      )}`,
    );
    if (diffObject.warn) {
      console.log(
        `${chalk.yellow(`WARN Diff detected:\n`)} ${diffObject.diff}`,
      );
      return { hasDiff: true };
    }
    return { hasDiff: false };
  } catch (err) {
    console.log(
      `${chalk.red(`Article with id ${article.id} failed to convert.`)}`,
      err,
    );
    return { error: err, id: article.id, hasError: true };
  }
}

function printResults(articles, results) {
  const errors = results.filter(result => result.hasError);
  const diffs = results.filter(result => result.hasDiff);
  const passed = results.filter(result => !result.hasDiff && !result.hasError);
  const passedString = chalk.bold.green(` ${passed.length} passed`) + ',';
  const errString =
    errors.length > 0 ? chalk.bold.red(` ${errors.length} failed`) + ',' : '';
  const diffString =
    diffs.length > 0 ? chalk.bold.yellow(` ${diffs.length} diffs`) + ',' : '';
  console.log(
    `${chalk.bold('Articles: ')}${passedString}${errString}${diffString} ${
      articles.length
    } total`,
  );
}

async function runCheck(argv) {
  await fetchSystemAccessToken();
  const url = `${getNdlaApiUrl(argv.env)}/article-api/v2/articles/`;

  if (argv.single) {
    const id = argv.single;
    const article = await fetchArticle(url, id);
    const result = testArticle(article);
    printResults([article], [result]);
  } else if (argv.write) {
    const articles = [];
    const articleIds = (await fetchAllArticles(url)).slice(1, 100);
    const results = await Promise.all(
      articleIds.map(async id => {
        const article = await fetchArticle(url, id);
        articles.push(article);
        return testArticle(article);
      }),
    );
    mkdirp.sync('./scripts/.cache');
    fs.writeFileSync(
      `./scripts/.cache/articles-${argv.env}.json`,
      JSON.stringify(articles),
      'utf8',
    );
    printResults(articles, results);
  } else {
    const path = `./scripts/.cache/articles-${argv.env}.json`;
    if (!fs.existsSync(path)) {
      console.log(
        `${chalk.red(
          `Run \`yarn check-articles -w instead\`. File with path ${path} does not exist.`,
        )}`,
      );
      return;
    }
    const contents = fs.readFileSync(path);
    const articles = JSON.parse(contents);

    const results = articles.map(testArticle);
    printResults(articles, results);
  }
}

module.exports = runCheck;
