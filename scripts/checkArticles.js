/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import jsdom from 'jsdom';
import config from '../src/config';
import {
  learningResourceContentToEditorValue,
  learningResourceContentToHTML,
} from '../src/util/articleContentConverter';
import { resolveJsonOrRejectWithError } from '../src/util/apiHelpers';

const chalk = require('chalk');
const queryString = require('query-string');
const fetch = require('isomorphic-fetch');
const fs = require('fs');
const jsdiff = require('diff');

const dom = new jsdom.JSDOM('<!DOCTYPE html></html>');

global.window = dom.window;
global.document = window.document;
global.navigator = window.navigator;
global.NodeFilter = window.NodeFilter;

const url = `${config.ndlaApiUrl}/article-api/v2/articles/`;
const { fragment } = jsdom.JSDOM;

const errors = [];

let token = '';
/* eslint no-console: 0 */
/* eslint no-await-in-loop: 0 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
}

async function fetchSystemAccessToken() {
  token = await fetch(`https://ndla.eu.auth0.com/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.NDLA_TEST_CLIENT_ID,
      client_secret: process.env.NDLA_TEST_CLIENT_SECRET,
      audience: 'ndla_system',
    }),
    json: true,
  }).then(resolveJsonOrRejectWithError);
}

async function fetchArticles(query) {
  const result = await fetch(`${url}?${queryString.stringify(query)}`, {
    headers: {
      'Cache-Control': 'no-cache',
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

async function fetchArticle(id) {
  await sleep(100);
  let result;
  result = await fetch(`${url}${id}`, {
    headers: {
      'Cache-Control': 'no-cache',
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

async function fetchAllArticles() {
  const query = {
    page: 1,
    'page-size': 100,
  };
  const firstResult = await fetchArticles(query, token);

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
    requests.push(fetchArticles({ ...query, page: i }, token));
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

function shouldWarnFromDiff(part) {
  return part.value.includes('embed') || part.count > 20;
}

function diffHTML(oldHtml, newHtml) {
  const diff = jsdiff.diffChars(oldHtml, newHtml);
  let diffString = '';
  const lengthDifference = Math.abs(newHtml.lenth - oldHtml.length);

  let shouldWarn = lengthDifference > 50;

  diff.forEach(part => {
    // green for additions, red for deletions
    // grey for common parts
    if (part.added) {
      diffString += `${chalk.green(part.value)}`;
    } else if (part.removed) {
      diffString += `${chalk.red(part.value)}`;
      shouldWarn = shouldWarn || shouldWarnFromDiff(part);
    } else {
      diffString += part.value;
    }
  });
  return { diff: diffString, warn: shouldWarn };
}

async function testArticle(id, article) {
  try {
    if (article) {
      const converted = learningResourceContentToEditorValue(
        article.content.content,
        fragment,
      );

      const diffObject = diffHTML(
        article.content.content,
        learningResourceContentToHTML(converted),
      );
      const diffString = diffObject.warn ? `diff: ${diffObject.diff}` : '';

      console.log(
        `${chalk.green(
          `Article with id ${id} was sucessfully converted to slate and back to HTML and the`,
        )} ${diffString}\n`,
      );
    }
  } catch (err) {
    errors.push({ error: err, id });
    console.log(
      `${chalk.red(`Article with id ${id} failed to convert.`)}`,
      err,
    );
  }
}

async function runCheck() {
  await fetchSystemAccessToken();
  const readFromFile = process.argv[2] !== '-write';
  if (!readFromFile) {
    const articles = [];
    const articleIds = await fetchAllArticles();
    await asyncForEach(articleIds, async id => {
      const article = await fetchArticle(id, token);
      articles.push(article);
      await testArticle(id, article);
    });
    fs.writeFileSync(
      './scripts/articles.json',
      JSON.stringify(articles),
      'utf8',
    );
  } else {
    const path = './scripts/articles.json';
    if (!fs.existsSync(path)) {
      console.log(
        `${chalk.red(
          `Run yarn check-articles-and-write instead. File with path ${path} does not exist.`,
        )}`,
      );
      return;
    }
    const contents = fs.readFileSync(path);
    const articles = await JSON.parse(contents);

    articles.forEach(article => {
      if (article) {
        testArticle(article.id, article);
      }
    });
  }
  console.log(
    `Total errors: ${errors.length}. Articles that is failing is: ${
      errors ? errors.map(error => (error ? error.id : '')) : '[]'
    }`,
  );
}
/* eslint-enable */
runCheck();
