FROM node:22-alpine

# Required for bcrypt (native C++ module)
RUN apk add --no-cache python3 make g++

RUN npm install -g pnpm@9

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/api-server run build

EXPOSE 3000

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
