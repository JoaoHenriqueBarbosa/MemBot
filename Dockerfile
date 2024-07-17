FROM oven/bun

WORKDIR /packages/server

COPY /packages/server/package.json .

RUN bun install

COPY /packages/server .

EXPOSE 3000/tcp

CMD ["bun", "index.ts"]