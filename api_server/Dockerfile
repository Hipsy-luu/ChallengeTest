
FROM node:14-alpine AS builder-stage

WORKDIR "/api_server"

COPY . .

RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:14-alpine AS production-stage

WORKDIR "/api_server"

COPY --from=builder-stage /api_server/package.json ./package.json
COPY --from=builder-stage /api_server/package-lock.json ./package-lock.json
COPY --from=builder-stage /api_server/dist ./dist
COPY --from=builder-stage /api_server/node_modules ./node_modules

EXPOSE 3000

CMD [ "sh", "-c", "npm run start:prod"]

#CMD ["node", "dist/main"]