FROM node:11.13.0-alpine
LABEL org.bitcartcc.image=store
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY . /usr/src/nuxt-app/
RUN apk add git yarn && yarn && yarn build
EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
