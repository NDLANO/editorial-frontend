/**
 * Copyright (c) 2019-present, NDLA.
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
const mkdirp = require('mkdirp');
const { diffHTML } = require('../../src/util/diffHTML');
const { getNdlaApiUrl } = require('../../src/config');
const {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} = require('../../src/util/articleContentConverter');
const {
  resolveJsonOrRejectWithError,
} = require('../../src/util/resolveJsonOrRejectWithError');

const dom = new jsdom.JSDOM('<!DOCTYPE html></html>');

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
  try {
    const result = await fetch(`${url}?${queryString.stringify(query)}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    return result.json();
  } catch (err) {
    console.log(
      `${chalk.red(`Search with query page ${query.page} is failing.`)}`,
      err,
    );
  }
}

async function fetchArticle(url, id, i = 10) {
  await sleep(10 * i);
  try {
    const result = await fetch(`${url}${id}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    return result.json();
  } catch (err) {
    if (err.status === 401) {
      await fetchSystemAccessToken();
      return fetchArticle(url, id);
    } else {
      console.log(`${chalk.red(`Article with id ${id} is failing`)}`, err);
      return err;
    }
  }
}

async function fetchAllArticles(url) {
  const query = {
    page: 1,
    'page-size': 100,
  };
  const firstResult = await fetchArticles(url, query);

  const numberOfPages = Math.min(
    Math.ceil(firstResult.totalCount / firstResult.pageSize),
    100,
  );
  const requestQueries = [];
  const estimatedTime = Math.ceil(
    (numberOfPages * query['page-size'] * 0.5) / 60,
  );

  console.log(
    `Fetching ${numberOfPages} pages with a page size of ${
      query['page-size']
    }. Estimated time is ${estimatedTime} minutes`,
  );

  for (let i = 1; i < numberOfPages + 1; i += 1) {
    requestQueries.push({ ...query, page: i });

    console.log(
      `${chalk.green(
        `Fetching page ${i} with page size ${query['page-size']}`,
      )}`,
    );
  }

  const articleIds = [];
  const results = await Promise.all(
    requestQueries.map(reqQuery => fetchArticles(url, reqQuery)),
  );
  results.forEach(result => {
    const articles =
      result && result.results ? result.results.map(article => article.id) : [];
    articleIds.push(...articles);
  });
  console.log(`fetched ${articleIds.length} number of article IDS`);
  return articleIds;
}

function testArticle(article) {
  if (!article || !article.id) {
    console.log(`${chalk.yellow(`No article!`)}`);
    return { hasError: true, error: article };
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
        `Article with id ${article.id} was sucessfully converted to slate and back to HTML.`,
      )}`,
    );
    if (diffObject.warn) {
      console.log(
        `${chalk.yellow(`WARN Diff detected:\n`)} ${diffObject.diff}`,
      );
      return { hasDiff: true, diff: diffObject.diff };
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
  mkdirp.sync('./scripts/.cache');
  fs.writeFileSync(
    `./scripts/.cache/results.json`,
    JSON.stringify({ ...diffs, ...errors }),
    'utf8',
  );
}

async function runCheck(argv) {
  await fetchSystemAccessToken();
  let url = `${getNdlaApiUrl(argv.env)}/article-api/v2/articles/`;
  if (argv.api && argv.api === 'draft-api') {
    url = `${getNdlaApiUrl(argv.env)}/draft-api/v1/drafts/`;
  }

  if (argv.single) {
    /* SINGLE ARTICLE */

    const id = argv.single;
    const article = await fetchArticle(url, id);
    const result = testArticle(article);
    printResults([article], [result]);
  } else if (argv.write) {
    /* FETCH ARTICLES */

    const articles = [];
    const articleIds = await fetchAllArticles(url);
    const results = await Promise.all(
      articleIds.map(async (id, i) => {
        const article = await fetchArticle(url, id, i + 1);
        if (article && article.id) {
          articles.push(article);
          return testArticle(article);
        }
        return article;
      }),
    );
    console.log('fetched all articles');
    mkdirp.sync('./scripts/.cache');
    fs.writeFileSync(
      `./scripts/.cache/articles-${argv.env}.json`,
      JSON.stringify(articles),
      'utf8',
    );
    printResults(articles, results);
  } else {
    /* USE CACHED ARTICLES */

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
    console.log(`${articles.length} articles cached, testing:`);
    const results = articles.map(testArticle);
    printResults(articles, results);
  }
}

module.exports = runCheck;
