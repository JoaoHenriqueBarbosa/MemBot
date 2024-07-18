FROM oven/bun
WORKDIR /app
COPY . .
WORKDIR /app/packages/private
RUN bash -c bun i
CMD ["bun", "run", "server.ts"]
EXPOSE 8081