FROM node:22-alpine

# Install pnpm@9 directly via npm (reliable, no corepack issues)
RUN npm install -g pnpm@9

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build api-server
RUN pnpm --filter @workspace/api-server run build

EXPOSE 3000

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
