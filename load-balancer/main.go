package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"
  
  "github.com/docker/docker/api/types/container"
  dockerClient "github.com/docker/docker/client"
	
  hatchetClient "github.com/hatchet-dev/hatchet/pkg/client"
)


var containers = []string{"ollama", "ollama-agent", "app-container"}
var scaleThreshold = 50 // Queue size threshold for scaling

// Initialize the Docker client
func initDockerClient() (*client.Client, error) {
	return client.NewClientWithOpts(client.WithAPIVersionNegotiation())
}

// Get container stats (CPU and memory usage)
func getContainerStats(cli *client.Client, containerName string) (*container.StatsResponse, error) {
	ctx := context.Background()
	stats, err := cli.ContainerStats(ctx, containerName, false)
	if err != nil {
		return nil, err
	}
	defer stats.Body.Close()

	var stat container.StatsResponse
	if err := json.NewDecoder(stats.Body).Decode(&stat); err != nil {
		return nil, err
	}
	return &stat, nil
}

// Calculate CPU percentage
func calculateCPUPercent(stat *container.StatsResponse) float64 {
	cpuDelta := float64(stat.CPUStats.CPUUsage.TotalUsage - stat.PreCPUStats.CPUUsage.TotalUsage)
	systemDelta := float64(stat.CPUStats.SystemUsage - stat.PreCPUStats.SystemUsage)
	cpuCount := float64(len(stat.CPUStats.CPUUsage.PercpuUsage))

	if systemDelta > 0.0 && cpuDelta > 0.0 {
		return (cpuDelta / systemDelta) * cpuCount * 100.0
	}
	return 0.0
}

// Check system metrics (CPU, memory, and queue size)
func checkSystemMetrics(cli *client.Client) error {
	for _, containerName := range containers {
		stats, err := getContainerStats(cli, containerName)
		if err != nil {
			log.Printf("Error fetching stats for container %s: %s", containerName, err)
			continue
		}

		cpuPercent := calculateCPUPercent(stats)

		memUsage := float64(stats.MemoryStats.Usage) / (1024 * 1024) // MB
		memLimit := float64(stats.MemoryStats.Limit) / (1024 * 1024) // MB
		memPercent := (memUsage / memLimit) * 100.0

		fmt.Printf("[Metrics] Container: %s | CPU: %.2f%% | Memory: %.2fMB / %.2fMB (%.2f%%)\n",
			containerName, cpuPercent, memUsage, memLimit, memPercent)

		// Example logic: scale down if memory > 80% or CPU > 50%
		if cpuPercent > 50.0 || memPercent > 80.0 {
			log.Printf("Scaling down due to high usage in %s\n", containerName)
			_ = scaleService(cli, -1)
		}
	}

	// Example: scale up if queue is too long (replace with real logic)
	queueLength := 100
	if queueLength > scaleThreshold {
		log.Printf("Scaling up due to queue length: %d\n", queueLength)
		_ = scaleService(cli, 2)
	}

	return nil
}

// Scale the service (placeholder)
func scaleService(cli *client.Client, scale int) error {
	fmt.Printf("Scaling by %d containers (stub function)\n", scale)
	// Add real scaling logic here (Docker Compose, Swarm, etc.)
	return nil
}

func main() {
	cli, err := initDockerClient()
	if err != nil {
		log.Fatalf("Docker client init failed: %v", err)
		os.Exit(1)
	}

	for {
		if err := checkSystemMetrics(cli); err != nil {
			log.Printf("Error: %v", err)
		}
		time.Sleep(10 * time.Second)
	}
}
