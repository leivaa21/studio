######################
##    Base Stage    ##
######################
FROM node:18-alpine as base

WORKDIR /usr/src/app

# Setup yarn
RUN corepack enable
RUN corepack prepare yarn@stable --activate

COPY package.json .
COPY yarn.lock .

RUN yarn plugin import workspace-tools

RUN yarn install

# Build commons

COPY packages/commons/package.json packages/commons/package.json

RUN yarn workspaces focus @studio/commons

COPY packages/commons packages/commons

RUN yarn m:dep:commons

# Build api-utils
COPY packages/api-utils/package.json packages/api-utils/package.json

RUN yarn workspaces focus @studio/api-utils

COPY packages/api-utils packages/api-utils

RUN yarn m:dep:apiutils

# Build dependency-injection
COPY packages/dependency-injection/package.json packages/dependency-injection/package.json

RUN yarn workspaces focus @studio/dependency-injection

COPY packages/dependency-injection packages/dependency-injection

RUN yarn m:dep:di

# Build ui
COPY packages/ui/package.json packages/ui/package.json

RUN yarn workspaces focus @studio/ui

COPY packages/ui packages/ui

######################
##   AuthAPI-dev    ##
######################
FROM base as api-auth-dev

COPY apis/auth apis/auth

RUN yarn install

CMD yarn d:api:auth

######################
##     AuthAPI      ##
######################
FROM base as api-auth

COPY apis/auth apis/auth

RUN yarn install

CMD yarn p:api:auth

######################
## ProfilesAPI-dev  ##
######################
FROM base as api-profiles-dev

COPY apis/profiles apis/profiles

RUN yarn install

CMD yarn d:api:profiles

######################
##    ProfilesAPI   ##
######################
FROM base as api-profiles

COPY apis/profiles apis/profiles

RUN yarn install

CMD yarn p:api:profiles

######################
## CoursesAPI-dev  ##
######################
FROM base as api-courses-dev

COPY apis/courses apis/courses

RUN yarn install

CMD yarn d:api:courses

######################
##    CoursesAPI   ##
######################
FROM base as api-courses

COPY apis/courses apis/courses

RUN yarn install

CMD yarn p:api:courses

######################
##      WEB-dev     ##
######################
FROM base as app-web-dev

COPY apps/web apps/web

RUN yarn install

CMD yarn d:app:web

######################
##        WEB       ##
######################
FROM base as app-web

COPY apps/web apps/web

RUN yarn install

CMD yarn p:app:web

######################
##   Storybook-dev  ##
######################
FROM base as app-sb-dev

COPY apps/storybook apps/storybook

RUN yarn install

CMD yarn d:app:sb

######################
##     Storybook    ##
######################
FROM base as app-sb

COPY apps/storybook apps/storybook

RUN yarn install

CMD yarn p:app:sb