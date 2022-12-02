######################
##    Base Stage    ##
######################
FROM node:18-alpine as base

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json .
COPY yarn.lock .

COPY packages packages

RUN yarn install

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

COPY apps/courses apps/courses

RUN yarn install

CMD yarn d:apps:web

######################
##        WEB       ##
######################
FROM base as app-web

COPY apps/web apps/web

RUN yarn install

CMD yarn p:apps:web

