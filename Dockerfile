FROM node:11.13.0-alpine
LABEL org.bitcartcc.image=store
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY . /usr/src/nuxt-app/
RUN apk add --virtual build-deps git && apk add yarn && yarn && yarn cache clean && yarn build && apk del build-deps
EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
