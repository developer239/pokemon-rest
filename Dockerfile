# --- Stage 1: Create User ---
FROM --platform=linux/amd64 node:20-alpine3.18 AS user

RUN addgroup -S appgroup && \
    adduser -S -G appgroup appuser

# --- Stage 2: Build ---
FROM --platform=linux/amd64 node:20-alpine3.18 AS build

WORKDIR /app

COPY package*.json yarn.lock ./
COPY pokemons.json ./

RUN yarn install --production=false

COPY . .

RUN npx nest build

# --- Stage 3: Run ---
FROM --platform=linux/amd64 node:20-alpine3.18 AS production

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --production

COPY --from=build /app/dist /app/dist
COPY --from=build /app/pokemons.json /app/pokemons.json

COPY --from=user /etc/passwd /etc/passwd
COPY --from=user /etc/group /etc/group
USER appuser

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main.js"]
