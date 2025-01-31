# Dockerfile
FROM node:18-alpine

# Add yarn to the image
RUN apk add --no-cache yarn

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript code
RUN yarn build

EXPOSE 4700

CMD ["yarn", "dev"]
