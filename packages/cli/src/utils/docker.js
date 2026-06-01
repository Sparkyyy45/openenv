export const dockerTemplates = {
  node: `
# Multi-stage Dockerfile for Node.js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN if [ -f "npm run build" ]; then npm run build; fi

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
  `.trim(),

  python: `
# Dockerfile for Python/FastAPI/Django
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "main.py"] # Update this depending on your entry point
  `.trim(),

  go: `
# Multi-stage Dockerfile for Go
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
  `.trim(),

  generic: `
# Generic Dockerfile
FROM ubuntu:latest
WORKDIR /app
COPY . .
CMD ["echo", "Please configure your Dockerfile"]
  `.trim()
};

/**
 * Generate a Dockerfile for the given stack.
 * Falls back to the generic template if the stack is not recognized.
 * @param {string} stack - 'node' | 'python' | 'go' | 'generic'
 * @returns {string} The Dockerfile content
 */
export function generateDockerfile(stack) {
  return dockerTemplates[stack] || dockerTemplates.generic;
}
