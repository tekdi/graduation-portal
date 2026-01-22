# ------------------------------------                                                                                                                                                                             
# Stage 1 — Build the application                                                                                                                                                                                  
# ------------------------------------
FROM node:22.21.1-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .
RUN yarn build:web


# ------------------------------------
# Stage 2 — Serve using Node.js
# ------------------------------------
FROM node:22.21.1-alpine

WORKDIR /app

RUN yarn global add serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
