# || #### BASE ##### ||
FROM node:18-alpine as base

# Directory
WORKDIR /usr/src/app

# Setup yarn
RUN corepack enable yarn
RUN corepack prepare yarn@3.3.0 --activate


# Setup general monorepo enviroment
COPY package.json package.json
COPY .yarnrc.yml .yarnrc.yml
COPY yarn.lock yarn.lock

COPY turbo.json turbo.json

# Copy source code

COPY packages packages
COPY apis apis
COPY apps apps
RUN yarn