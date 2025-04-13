# Stage 1: Builder stage for installing dependencies and binaries
FROM oven/bun:debian AS builder

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    git \
    unzip \
    gnupg \
    libgbm-dev \
    libglib2.0-0 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    xvfb \
    xauth \
    libevent-2.1 \
    ca-certificates \
    # libopus \
    # libepoxy \
    # libjpeg \
    # libwebpmux \
    # libwebp \
    # libgtk-3 \
    # libgdk-3 \
    # libpangocairo-1 \
    # libcairo-gobject \
    # libgdk_pixbuf-2 \
    # libxslt \
    # liblcms2 \
    # libwoff2dec \
    # libflite \
    # libflite_usenglish \
    # libflite_cmu_grapheme_lang \
    # libflite_cmu_grapheme_lex \
    # libflite_cmu_indic_lang \
    # libflite_cmu_indic_lex \
    # libflite_cmulex \
    # libflite_cmu_time_awb \
    # libflite_cmu_us_awb \
    # libflite_cmu_us_kal16 \
    --no-install-recommends

# Set up working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json bun.lock ./
RUN bun install

# Install Playwright with WebKit
RUN bunx playwright install webkit
RUN bunx playwright install-deps webkit

RUN ls /root/.cache/ms-playwright
RUN ls /root/.cache/ms-playwright/webkit*

# Copy application code
COPY . .

# Build application
RUN bun run build

# Stage 2: Distroless Wolfi image for runtime
# FROM cgr.dev/chainguard/wolfi-base:latest
# FROM debian:latest

# Create necessary directories
# WORKDIR /app

# Install minimal dependencies required for Playwright and WebKit
# Corrected package names for Wolfi repository
# RUN apk add --no-cache \
#     ca-certificates \
#     dbus \
#     fontconfig \
#     freetype \
#     glib \
#     libgcc \
#     libstdc++ \
#     nss
# RUN apt-get update && apt-get install -y \
#     ca-certificates \
#     dbus \
#     fontconfig \
#     xvfb
# Copy Bun runtime from builder

# COPY --from=builder /usr/local/bin/bun /usr/local/bin/
# COPY --from=builder /usr/local/bin/bunx /usr/local/bin/

# Copy Playwright and browser binaries
# COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright
# COPY --from=builder /root/.playwright /root/.playwright

# Copy application
# COPY --from=builder /app /app

# Set environment variables
ENV PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright
ENV DISPLAY=:99

# Set up Xvfb for non-headless mode
RUN echo '#!/bin/sh\nXvfb :99 -screen 0 1280x1024x24 &\nexec "$@"' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

RUN ls -a

# RUN ls /root/.cache/ms-playwright/webkit-2140/pw_run.sh

ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# Default command to run your application
CMD ["/usr/local/bin/bun", "run", "start"]

# Expose any ports your application uses
EXPOSE 3000
