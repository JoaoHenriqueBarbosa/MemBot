FROM oven/bun
WORKDIR /app
COPY . .
WORKDIR /app/packages/private
RUN bun install
CMD ["bun", "run", "server.ts"]
EXPOSE 8081