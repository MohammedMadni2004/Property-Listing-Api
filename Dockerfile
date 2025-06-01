from node:20

workdir /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

ENTRYPOINT ["node", "dist/index.js"]