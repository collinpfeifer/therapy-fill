# Stage 1: Builder
FROM debian:bullseye-slim AS builder

# Install bun
RUN apt-get update && apt-get install -y curl ca-certificates unzip && \
    curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:$PATH"

# Add dependencies for Playwright WebKit
RUN apt-get install -y \
    libglib2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libwoff1 libopus0 libwebp6 \
    libwebpdemux2  libgudev-1.0-0 libsecret-1-0 libhyphen0 \
    libgstreamer1.0-0 libgstreamer-plugins-base1.0-0 \
    libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxrandr2 \
    libasound2 libatk-bridge2.0-0 libatspi2.0-0 libdrm2 libgbm1 \
    libxshmfence1 libxinerama1 libpango-1.0-0 fonts-liberation

# Your app
WORKDIR /app
COPY . .

# Install deps and WebKit only
RUN bun install --production --frozen-lockfile
RUN bunx playwright install webkit --with-deps

RUN ls -lah /root/.cache/ms-playwright/webkit*
RUN ls -lah /root/.cache/ms-playwright/
RUN ls -lah /root/.cache/ms-playwright/webkit*/pw_run.sh

# Build the app
RUN bun run build

# Stage 2: Distroless runtime
FROM cgr.dev/chainguard/wolfi-base:latest AS runtime

WORKDIR /app

# Copy bun runtime
COPY --from=builder /root/.bun /root/.bun
ENV PATH="/root/.bun/bin:$PATH"


# Copy build file over
COPY --from=builder  /app/dist/index.js /app/dist/index.js
COPY --from=builder /app/node_modules /app/node_modules
# COPY --from=builder  /app/package.json /app/package.json

# Copy browser cache (WebKit)
COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright

# Copy only required libs (try to avoid full /lib or /usr)
# COPY --from=builder /lib/x86_64-linux-gnu /lib/x86_64-linux-gnu
# COPY --from=builder /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu
# COPY --from=builder /usr/share/fonts /usr/share/fonts

EXPOSE 4000/tcp
ENTRYPOINT ["bun", "run", "dist/index.js"]
