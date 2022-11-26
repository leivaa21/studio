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
##   CoreAPI-dev    ##
######################
FROM base as api-core-dev

COPY apis/core apis/core

RUN yarn install

CMD yarn d:api:core

######################
##     CoreAPI      ##
######################
FROM base as api-core

COPY apis/core apis/core

RUN yarn install

CMD yarn p:api:core

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
