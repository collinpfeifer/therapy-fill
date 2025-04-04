# Use Bun base image
FROM oven/bun:latest

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install

# Copy app files
COPY . .

# Expose LangChain API
EXPOSE 4000

CMD ["bun", "run", "index.ts"]
