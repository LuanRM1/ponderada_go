# Build stage
FROM golang:1.21-alpine AS builder

# Set working directory
WORKDIR /build

# Install build dependencies
RUN apk update && apk add --no-cache git gcc musl-dev

# Copy the entire source code
COPY . .

# Download dependencies and build
RUN go mod download && \
    go mod tidy && \
    CGO_ENABLED=0 GOOS=linux go build -o main

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /build/main .

# Create uploads directory
RUN mkdir -p /app/uploads/users /app/uploads/products

# Expose port
EXPOSE 8080

# Run the application
CMD ["./main"] 