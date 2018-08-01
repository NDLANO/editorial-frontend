const queryString = require('query-string');
const fetch = require('isomorphic-fetch')

const url = 'https://test.api.ndla.no/article-api/v2/articles/';


function resolveJsonOrRejectWithError(res) {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return resolve(res.json());
    }
    res.json().then(json => {
      console.log(json.message || json.description)
    })
    return resolve()
  });
}

function fetchSystemAccessToken() {
  return fetch(`https://ndla.eu.auth0.com/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: `d`,
        client_secret: `d`,
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
    }).then(resolveJsonOrRejectWithError);
    return result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllArticles(){
  const query = {
    page: 1,
    'page-size': 100,
  };
  const token = await fetchSystemAccessToken();
  const results = []
  const firstResult = await fetchArticles(query, token);
  results.push(...firstResult.results.map(article => article.id))
  const numberOfPages = Math.ceil(firstResult.totalCount / firstResult.pageSize);
  const requests = [];
  let counter = 2;
  while(true) {
    requests.push(fetchArticles({'page-size': 100, page: counter}, token));
    await sleep(100); // eslint-disable-line
    console.log(`Fetching page ${counter} with page size 20`);
    counter += 1;
    if (counter === numberOfPages) break;
  }
  const allResults =await  Promise.all(requests.map(r => r))
  console.log("D", allResults)
  const re = await allResults.then(l => {
    console.log("EY", l);
  }).catch(err => console.log("err", err))
}

function init() {
  fetchAllArticles();
}

init();
