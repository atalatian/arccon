# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install firebase-tools globally
RUN npm install -g firebase-tools

# Copy the local app directory (if needed) to the container
COPY . .

# Default command to keep the container alive (can be overridden in docker-compose)
CMD ["npm", "run", "start"]
