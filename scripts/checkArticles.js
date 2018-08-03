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

const errors = [];

let token = '';

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
    }).then(resolveJsonOrRejectWithError)
}

async function fetchArticles(query) {
   const result = await fetch(`${url}?${queryString.stringify(query)}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }).then(resolveJsonOrRejectWithError).catch((err) => console.log(`${chalk.red(`Search with query page: ${query.page} is failing`)}`, err));;
    return result;
}

async function fetchArticle(id) {

    let result;
    result = await fetch(`${url}${id}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }).then(resolveJsonOrRejectWithError).catch(async (err) => {
      if (err.status === 401) {
        await fetchSystemAccessToken();
        result = await fetchArticle(id);
      } else {
        console.log(`${chalk.red(`ID: ${id} is failing`)}`, err);
      }
    });
    return result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index+= 1) {
    await callback(array[index], index, array) //eslint-disable-line
  }
}

async function fetchAllArticles(){
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
    console.log(`🔍  ${chalk.green(`Fetching page ${counter} with page size 100`)}`)
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


async function testArticle(id) {
  await sleep(1000); // eslint-disable-line
  const article = await fetchArticle(id, token);
  try {
    if (article) {
      const converted = learningResourceContentToEditorValue(article.content.content, fragment);
      learningResourceContentToHTML(converted);
      console.log(`${chalk.green(`Id ${id} was sucessfully converted to slate and back. The article id is: ${article.id}`)}`);
    }
  } catch (err) {
    errors.push({error: err, id})
    console.log(`${chalk.red(`Article with id ${id} is failing`)}`, err);
  }
}

 async function run() {
   console.log(process.env)
  await fetchSystemAccessToken();
  const readFromFile = process.argv[2] !== '-write';
  if (!readFromFile) {
    const articleIds = await fetchAllArticles();
    await asyncForEach(articleIds, async (id) => {
       await testArticle(id)
     });
  } else {
    const articles = JSON.parse("./articles.json");
  }
  console.log(`Total errors: ${errors.length}`)
}

run();
