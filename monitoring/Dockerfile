# Use an official Go runtime as a parent image
FROM golang:1.19-alpine

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the Go code into the container
COPY . .

# Install dependencies
RUN go mod tidy

# Build the Go app
RUN go build -o monitor .

# Run the Go app
CMD ["./monitor"]
