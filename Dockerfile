FROM oven/bun
WORKDIR /app
COPY . .
WORKDIR /app/packages/private
RUN bash -c bun i
RUN bash -c bun i bcrypt
RUN bash -c bun i -D @types/bcrypt
CMD ["bun", "run", "server.ts"]
EXPOSE 8081