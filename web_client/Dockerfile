## Stage 1
#FROM node:16 as build-stage
#
#WORKDIR /web_client
#
#COPY . .
#
#RUN npm ci
#
#RUN npm run build
#
## Stage 2
#FROM nginx:1.17.0-alpine AS production-stage
#
#COPY --from=build-stage /web_client/dist /usr/share/nginx/html
#
#EXPOSE 4200
#
#CMD nginx -g 'daemon off;'
### STAGE 1: Build ###
FROM node:14-alpine as build-stage

WORKDIR "/web_client"

COPY . .
RUN npm install
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine AS production-stage

WORKDIR "/web_client"
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /web_client/dist /usr/share/nginx/html