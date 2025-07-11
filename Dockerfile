### Build stage
FROM node:22.16.0-alpine3.21 AS builder

ENV HOME=/home/app
ENV APP_PATH=$HOME/editorial-frontend

# Copy necessary files for installing dependencies
COPY yarn.lock package.json .yarnrc.yml $APP_PATH/

# Enable yarn
RUN corepack enable

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn install --immutable

# Copy necessary source files for server and client build
COPY tsconfig.json vite.config.ts postcss.config.cjs panda.config.ts index.html $APP_PATH/
COPY scripts $APP_PATH/scripts

COPY src $APP_PATH/src
COPY custom-typings $APP_PATH/custom-typings
COPY public $APP_PATH/public

# Build client code
RUN yarn run build

### Run stage
FROM node:22.16.0-alpine3.21

WORKDIR /home/app/editorial-frontend
COPY --from=builder /home/app/editorial-frontend/build build

ENV NODE_ENV=production
ENV APPLICATION_NAME="editorial-frontend"

CMD ["node", "build/server.mjs"]
