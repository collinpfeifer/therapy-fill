# Base image with Bun
FROM oven/bun:latest

# Install Playwright dependencies
RUN apt update && apt install -y libnss3 libxss1 libasound2 libatk-bridge2.0-0 libcups2 libxkbcommon-x11-0

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the entire app
COPY . .

# Install Playwright browsers
RUN bun x playwright install --with-deps

# Ensure session file is stored in a persistent volume
VOLUME ["/app/session"]

# Expose the API port
EXPOSE 3000

# Run the app
CMD ["bun", "run", "app.ts"]
