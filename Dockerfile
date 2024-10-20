# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies based on package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all project files
COPY . .

# Build the Next.js application
RUN npm run build

RUN chmod +x ./installPackages.sh

RUN ./installPackages.sh

# Stage 2: Serve the application
FROM node:18-alpine AS runner

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Set the port Next.js will run on
EXPOSE 3000
EXPOSE 8000

# Start the Next.js application
CMD ["npm", "run", "start"]
