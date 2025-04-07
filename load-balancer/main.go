package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/swarm"
	dockerClient "github.com/docker/docker/client"

	hatchetClient "github.com/hatchet-dev/hatchet/pkg/client"
)

var containers = []string{"ollama", "ollama-agent", "app-container"}
var scaleThreshold = 50 // Queue size threshold for scaling

// Initialize the Docker client
func initDockerClient() (*dockerClient.Client, error) {
	return dockerClient.NewClientWithOpts(dockerClient.WithAPIVersionNegotiation())
}

func initHatchetClient() (hatchetClient.Client, error) {
	return hatchetClient.New(hatchetClient.WithToken(""))
}

// Get container stats (CPU and memory usage)
func getContainerStats(cli *dockerClient.Client, containerName string) (*container.StatsResponse, error) {
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
func checkSystemMetrics(cli *dockerClient.Client, hatchetCli hatchetClient.Client) error {
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
			log.Printf("Scaling up due to high usage in %s\n", containerName)
			replicas, err := scaleService(cli, stats.ID, 1, true)
			if err != nil {
				log.Printf("Error scaling down service %s: %s", stats.ID, err)
			}
			_ = waitForServiceScale(cli, stats.ID, replicas)
		} else if cpuPercent < 20.0 && memPercent < 30.0 {
			log.Printf("Scaling down due to low usage in %s\n", containerName)
			replicas, err := scaleService(cli, stats.ID, 1, false)
			if err != nil {
				log.Printf("Error scaling down service %s: %s", stats.ID, err)
			}
			_ = waitForServiceScale(cli, stats.ID, replicas)
		} else {
			log.Printf("No scaling action needed for %s\n", containerName)
		}

		// Example: scale up if queue is too long (replace with real logic)
		// queueLength := 100
		queueLength, err := getTaskQueue(hatchetCli)
		if err != nil {
			log.Printf("Error fetching task queue length: %s", err)
			return err
		}
		if queueLength > scaleThreshold {
			log.Printf("Scaling up due to queue length: %d\n", queueLength)
			replicas, _ := scaleService(cli, stats.ID, 2, true)
			_ = waitForServiceScale(cli, stats.ID, replicas)
		}
	}

	return nil
}

func scaleService(cli *dockerClient.Client, serviceID string, replicas uint64, scaleUp bool) (uint64, error) {
	ctx := context.Background()

	// Get current service spec
	service, _, err := cli.ServiceInspectWithRaw(ctx, serviceID, types.ServiceInspectOptions{})
	if err != nil {
		return 1, fmt.Errorf("failed to inspect service: %v", err)
	}

	// Create service update configuration
	serviceSpec := service.Spec

	// Update the number of replicas
	if serviceSpec.Mode.Replicated == nil {
		serviceSpec.Mode.Replicated = &swarm.ReplicatedService{}
	}
	if scaleUp {
		replicas = *serviceSpec.Mode.Replicated.Replicas + replicas
	} else {
		replicas = *serviceSpec.Mode.Replicated.Replicas - replicas
	}
	serviceSpec.Mode.Replicated.Replicas = &replicas

	// Update service with new replica count
	updateOpts := types.ServiceUpdateOptions{}
	response, err := cli.ServiceUpdate(ctx, serviceID, service.Version, serviceSpec, updateOpts)
	if err != nil {
		return replicas, fmt.Errorf("failed to update service: %v", err)
	}

	// Check for warnings
	if len(response.Warnings) > 0 {
		fmt.Printf("Warnings: %v\n", response.Warnings)
	}

	return replicas, nil
}

func waitForServiceScale(cli *dockerClient.Client, serviceID string, expectedReplicas uint64) error {
	ctx := context.Background()
	for {
		service, _, err := cli.ServiceInspectWithRaw(ctx, serviceID, types.ServiceInspectOptions{})
		if err != nil {
			return err
		}

		if *service.Spec.Mode.Replicated.Replicas == expectedReplicas {
			// Check if all tasks are running
			tasks, err := cli.TaskList(ctx, types.TaskListOptions{
				Filters: filters.NewArgs(filters.Arg("service", serviceID)),
			})
			if err != nil {
				return err
			}

			runningCount := 0
			for _, task := range tasks {
				if task.Status.State == swarm.TaskStateRunning {
					runningCount++
				}
			}

			if uint64(runningCount) == expectedReplicas {
				return nil
			}
		}

		time.Sleep(1 * time.Second)
	}
}

func getTaskQueue(hatchetCli hatchetClient.Client) (int, error) {
	return 0, nil
}

func main() {
	cli, err := initDockerClient()
	hatchetCli, err := initHatchetClient()
	if err != nil {
		log.Fatalf("Client init failed: %v", err)
		os.Exit(1)
	}

	for {
		if err := checkSystemMetrics(cli, hatchetCli); err != nil {
			log.Printf("Error: %v", err)
		}
		time.Sleep(10 * time.Second)
	}
}
