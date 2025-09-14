# Use official Node.js 22 Alpine image (lightweight)
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose port 3000 (used by Vite development server)
EXPOSE 3000

# Default command to start the app
CMD ["npm", "run", "VoxVerse"]