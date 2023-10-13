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

RUN yarn install

# || #### Auth-dev ##### ||
FROM base as auth-dev

RUN yarn turbo run build --filter="@studio/api-auth"
CMD yarn d:api:auth

# || #### Courses-dev ##### ||
FROM base as courses-dev

RUN yarn turbo run build --filter="@studio/courses"
CMD yarn d:api:courses

# || #### Web-dev ##### ||
FROM base as Web-dev

RUN yarn turbo run build --filter="@studio/web"
CMD yarn d:app:web

# || #### Desing-system-dev ##### ||
FROM base as desing-system-dev

RUN yarn turbo run build --filter="@studio/storybook"
CMD yarn d:app:sb