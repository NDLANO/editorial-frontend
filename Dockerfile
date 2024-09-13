### Build stage
FROM node:20.13.1-alpine3.18 as builder

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
FROM node:20.13.1-alpine3.18

RUN apk add py-pip jq && pip install awscli
COPY run-editorial-frontend.sh /


WORKDIR /home/app/editorial-frontend
COPY --from=builder /home/app/editorial-frontend/build build

ENV NODE_ENV=production

CMD ["/run-editorial-frontend.sh", "node build/server.mjs"]
