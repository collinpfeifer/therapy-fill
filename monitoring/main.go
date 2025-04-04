package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
)

var containers = []string{"ollama", "ollama-agent", "app-container"}
var scaleThreshold = 50 // Queue size threshold for scaling

// Initialize the Docker client
func initDockerClient() (*client.Client, error) {
	cli, err := client.NewClientWithOpts(client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, err
	}
	return cli, nil
}

// Get container stats (CPU and memory usage)
func getContainerStats(cli *client.Client, containerName string) (*types.StatsJSON, error) {
	ctx := context.Background()
	stats, err := cli.ContainerStats(ctx, containerName, false)
	if err != nil {
		return nil, err
	}
	defer stats.Body.Close()

	var stat types.StatsJSON
	err = json.NewDecoder(stats.Body).Decode(&stat)
	if err != nil {
		return nil, err
	}

	return &stat, nil
}

// Check system metrics (CPU, memory, and queue size)
func checkSystemMetrics(cli *client.Client) error {
	// Get container stats
	for _, containerName := range containers {
		stats, err := getContainerStats(cli, containerName)
		if err != nil {
			log.Printf("Error fetching stats for container %s: %s", containerName, err)
			continue
		}

		// Log CPU and memory usage
		cpuUsage := stats.CPUStats.CPUUsage.TotalUsage
		memUsage := stats.MemoryStats.Usage
		fmt.Printf("Container: %s - CPU Usage: %d, Memory Usage: %d\n", containerName, cpuUsage, memUsage)
	}

	// Placeholder for queue length (You should replace this with actual queue size logic)
	queueLength := 100 // Example: You can integrate your queue logic here
	return adjustScalingBasedOnQueue(cli, queueLength)
}

// Adjust scaling based on queue size and resource utilization
func adjustScalingBasedOnQueue(cli *client.Client, queueLength int) error {
	if queueLength > scaleThreshold {
		// Scale up (add more replicas)
		err := scaleService(cli, 2) // Scale up by 2 replicas (or adjust as needed)
		if err != nil {
			return err
		}
	}

	// Fetch stats for each container and check resource usage
	for _, containerName := range containers {
		stats, err := getContainerStats(cli, containerName)
		if err != nil {
			log.Printf("Error fetching stats for container %s: %s", containerName, err)
			continue
		}

		// If CPU exceeds 50% or memory exceeds 80%, scale down
		if stats.CPUStats.CPUUsage.TotalUsage > 50 || stats.MemoryStats.Usage > 80 {
			log.Printf("Scaling down due to high resource usage in %s", containerName)
			err := scaleService(cli, -1) // Scale down by 1 replica
			if err != nil {
				return err
			}
		}
	}

	return nil
}

// Scale the service (increase or decrease replicas)
func scaleService(cli *client.Client, scale int) error {
	// Replace with your API call or scaling logic (e.g., using a Docker Compose service scaling)
	fmt.Printf("Scaling service by %d\n", scale)

	// You can use the Docker API to update service replicas if using Swarm, or just restart containers directly
	// Example for Docker Swarm (if used)
	// serviceUpdateConfig := types.ServiceUpdateOptions{ /* Your options here */ }
	// cli.ServiceUpdate(...)
	return nil
}

func main() {
	// Initialize Docker client
	cli, err := initDockerClient()
	if err != nil {
		log.Fatalf("Failed to initialize Docker client: %s", err)
		os.Exit(1)
	}

	// Monitor system metrics
	for {
		err := checkSystemMetrics(cli)
		if err != nil {
			log.Printf("Error monitoring system metrics: %s", err)
		}

		// Wait for 10 seconds before checking again
		time.Sleep(10 * time.Second)
	}
}
