![CI](https://github.com/NDLANO/editorial-frontend/workflows/CI/badge.svg)

# ED

NDLA Editorial Frontend for producing content for NDLA

## Requirements

- Node.JS 20.9
- yarn v4
- Docker (optional)

## Getting started

What's in the box?

- React
- Express
- Vite + Babel (ES6)

### Dependencies

All dependencies are defined in `package.json` and are managed with npm/yarn. To
initially install all dependencies and when the list dependency has changed,
run `yarn install`.

```
$ yarn install
```

### Start development server

Start node server with hot reloading middleware listening on port 3000.

```
$ yarn start
```

To use a different api set the `NDLA_ENVIRONMENT` environment variable.

### Unit tests

Test framework: Vitest with React Testing Library.

```
$ yarn test
```

### e2e tests

[Playwright](https://playwright.dev/) is used for end to end testing.

```
$ yarn e2e
```

To circumvent api call flakiness all request are mocked when the tests are run on ci. Use the following command to record new mocks when api-calls change:

```
$ yarn e2e:record
```

Playwright tests can also be run in headless mode with mocked API calls.

```
$ yarn e2e:headless
```

### Code style

_tl;dr_: Use prettier and eslint!

Format code with prettier to get uniform codestyle:

```
$ yarn format
```

Lint code with [eslint](http://eslint.org/), including [eslint react plugin](https://github.com/yannickcr/eslint-plugin-react), [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import), [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y#readme).
Beside linting with globally installed eslint, eslint can be invoked with `yarn`:

```
$ yarn lint
```

Rules are configured in `./.eslintrc.js` and extends [eslint-config-react-app](https://github.com/facebook/create-react-app/tree/master/packages/eslint-config-react-app). If feeling brave, try `eslint --fix`.

## Other scripts

```
# Create minified production ready build with vite (rollup):
$ yarn build
```

```
# Docker stuff
$ ./build.sh
```
