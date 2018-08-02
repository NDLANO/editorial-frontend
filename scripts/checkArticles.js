import jsdom from 'jsdom';
import { learningResourceContentToEditorValue, learningResourceContentToHTML } from '../src/util/articleContentConverter';
import {
  resolveJsonOrRejectWithError,
} from '../src/util/apiHelpers';

const chalk = require('chalk');
const queryString = require('query-string');
const fetch = require('isomorphic-fetch')

const url = 'https://staging.api.ndla.no/article-api/v2/articles/';
const { fragment } = jsdom.JSDOM;


/* function resolveJsonOrRejectWithError(res) {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return resolve(res.json());
    }
    res.json().then(json => {
      const reply = {
        ...json,
        statusCode: res.status,
      }
      console.log(reply)
    }).catch(err => reject(new Error({...err, statusCode: res.status})))
    reject(new Error ({statusCode: res.status}))
  });
} */

let errorCounter = 0;

function fetchSystemAccessToken() {
  return fetch(`https://ndla.eu.auth0.com/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: ``,
        client_secret: ``,
        audience: 'ndla_system',
      }),
      json: true,
    }).then(resolveJsonOrRejectWithError)
}

async function fetchArticles(query, token) {
   const result = await fetch(`${url}?${queryString.stringify(query)}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }).then(resolveJsonOrRejectWithError).catch((err) => console.log(`${chalk.red(`Search with query page: ${query.page} is failing`)}`, err));;
    return result;
}

async function fetchArticle(id, token) {
   const result = await fetch(`${url}${id}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }).then(resolveJsonOrRejectWithError).catch((err) => console.log(`${chalk.red(`ID: ${id} is failing`)}`, err));
    return result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllArticles(token){
  const query = {
    page: 1,
    'page-size': 100,
  };
  const articleIds = []
  const firstResult = await fetchArticles(query, token);
  articleIds.push(...firstResult.results.map(article => article.id))
  const numberOfPages = Math.ceil(firstResult.totalCount / firstResult.pageSize);
  const requests = [];
  let counter = 1;
  while(true) {
    requests.push(fetchArticles({'page-size': 100, page: counter}, token));
    await sleep(1000); // eslint-disable-line
    counter += 1;
    console.log(`🔍 ${chalk.green(`Fetching page ${counter} with page size 100`)}`)
    if (counter === 10) break;
  }
  const allResults = await Promise.all(requests.map(r => r))
   allResults.map((res) => {
    const articles = res ? res.results.map(article => article.id) : [];
    articleIds.push(...articles)
    return res;
  });
  return articleIds;
}


async function testArticle(id, token) {
  await sleep(1000); // eslint-disable-line
  const article = await fetchArticle(id, token);
  try {
    if (article) {
      const converted = learningResourceContentToEditorValue(article.content.content, fragment);
      learningResourceContentToHTML(converted);
      console.log(`${chalk.green(`ID: ${id} was sucessfully converted to slate and back`)}`);
    }
  } catch (err) {
    errorCounter += 1;
    console.log(`${chalk.red(`ID: ${id} is failing`)}`, err);
  }
}

 async function run() {
   console.log(process.argv)
  const token = await fetchSystemAccessToken();
  const readFromFile = process.argv[2] !== '-read';
  if (!readFromFile) {
    const articleIds = await fetchAllArticles(token);
    await Promise.all(articleIds.forEach(id => {
      setInterval(() => {
        testArticle(id, token);
      }, 10000)
    }));
  } else {
    const articles = JSON.parse("./articles.json");
  }
  console.log(`Total errors: ${errorCounter}`)
}

run();
