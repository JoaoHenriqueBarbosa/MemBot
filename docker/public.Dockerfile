FROM oven/bun
WORKDIR /app
COPY . .
WORKDIR /app/packages/public
RUN bash -c bun i
CMD ["bun", "dev"]
EXPOSE 5173