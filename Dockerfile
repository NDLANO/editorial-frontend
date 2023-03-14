### Build stage
FROM node:18.12-alpine as builder

ENV HOME=/home/app
ENV APP_PATH=$HOME/editorial-frontend

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn

# Copy necessary source files for server and client build
COPY .babelrc tsconfig.json postcss.config.js $APP_PATH/
COPY webpack $APP_PATH/webpack
COPY scripts $APP_PATH/scripts

COPY src $APP_PATH/src
COPY custom-typings $APP_PATH/custom-typings
COPY public $APP_PATH/public

# Build client code
RUN yarn run build

### Run stage
FROM node:18.12-alpine

RUN apk add py-pip jq && pip install awscli
COPY run-editorial-frontend.sh /


WORKDIR /home/app/editorial-frontend
COPY --from=builder /home/app/editorial-frontend/build build

ENV NODE_ENV=production

CMD ["/run-editorial-frontend.sh", "node build/server.js '|' bunyan"]
