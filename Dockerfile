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

EXPOSE 3000

CMD ["yarn", "start"]

# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      # Update this URI according to your MongoDB database name
      - MONGODB_URI=mongodb://mongodb:27017/your_database_name
      # Change this to your actual secret key, preferably from a .env file
      - JWT_SECRET=${JWT_SECRET}
      # Add any other environment variables your app needs
      - PORT=3000
    depends_on:
      - mongodb
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - store-network

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - store-network

volumes:
  mongodb_data:

networks:
  store-network:
    driver: bridge