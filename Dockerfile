# --- Stage 1: Build Stage ---
FROM node:24-alpine AS builder

WORKDIR /app

# Copy yarn lockfile and package configuration
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for TypeScript compilation)
RUN yarn install --frozen-lockfile

# Copy application source code
COPY . .

# Build the TypeScript production code to ./dist
RUN yarn build

# --- Stage 2: Production Stage ---
FROM node:24-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy yarn lockfile and package configuration
COPY package.json yarn.lock ./

# Install ONLY production dependencies to keep the final image minimal
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy compiled JS bundle from builder stage
COPY --from=builder /app/dist ./dist

# Run container as non-root user for security
USER node

EXPOSE ${API_SERVER_PORT}

CMD ["node", "dist/main"]
