# Dockerfile for InsightIQ Frontend
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY src/frontend/package.json src/frontend/package-lock.json ./src/frontend/

# Install dependencies
RUN npm ci
RUN cd src/frontend && npm ci

# Copy source code
COPY src/frontend/ ./src/frontend/
COPY src/shared/ ./src/shared/

# Build the application
RUN cd src/frontend && npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/src/frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]