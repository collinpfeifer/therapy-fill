import { createSignal, createEffect, onCleanup, For } from "solid-js";
import { GripVertical } from "lucide-solid";

const initialClients = [
  { id: 1, name: "Alice Johnson", priority: "High" },
  { id: 2, name: "Bob Smith", priority: "Medium" },
  { id: 3, name: "Carol Williams", priority: "Low" },
  { id: 4, name: "David Brown", priority: "High" },
  { id: 5, name: "Eva Davis", priority: "Medium" },
];

const ClientListAnimation = () => {
  const [clients, setClients] = createSignal(initialClients);
  const [draggedClient, setDraggedClient] = createSignal<number | null>(null);
  const [dragPosition, setDragPosition] = createSignal<{
    x: number;
    y: number;
  } | null>(null);
  let cursorRef!: HTMLDivElement;
  let containerRef!: HTMLUListElement;

  const moveCursor = (x: number, y: number) => {
    if (cursorRef) {
      cursorRef.style.left = `${x}px`;
      cursorRef.style.top = `${y}px`;
      cursorRef.style.opacity = "1";
    }
  };

  const animateDrag = (startIndex: number, endIndex: number) => {
    return new Promise<void>((resolve) => {
      const itemHeight = 48;
      const startY = startIndex * itemHeight + 260;
      const endY = endIndex * itemHeight + 90;
      const duration = 1000;
      const grabDuration = 200;
      const dropDuration = 200;
      const moveDuration = duration - grabDuration - dropDuration;
      const x = 30 + Math.floor(Math.random() * 300);

      setTimeout(() => {
        setDraggedClient(startIndex);
        setDragPosition({ x, y: startY });
      }, 0);

      setTimeout(() => {
        setDragPosition({ x, y: startY - 10 });
      }, grabDuration);

      const moveSteps = 20;
      for (let i = 1; i <= moveSteps; i++) {
        setTimeout(
          () => {
            const progress = i / moveSteps;
            const newY = startY + (endY - startY) * progress - 10;
            setDragPosition({ x, y: newY });
            moveCursor(x, newY);
          },
          grabDuration + (moveDuration * i) / moveSteps,
        );
      }

      setTimeout(() => {
        setDragPosition({ x, y: endY });
        setClients((prevClients) => {
          const newClients = [...prevClients];
          const [draggedItem] = newClients.splice(startIndex, 1);
          newClients.splice(endIndex, 0, draggedItem);
          return newClients;
        });
      }, duration - dropDuration);

      setTimeout(() => {
        setDraggedClient(null);
        setDragPosition(null);
        resolve();
      }, duration);
    });
  };

  const getItemStyle = (index: number) => {
    if (draggedClient() === null || dragPosition() === null) {
      return {};
    }

    const itemHeight = 48;
    const draggedIndex = Math.round(dragPosition().y / itemHeight);

    if (index === draggedClient()) {
      return {
        transform: `translate3d(0, ${dragPosition().y - index * itemHeight * 1.9}px, 0)`,
        transition: "transform 0.1s ease-in-out",
        zIndex: 20,
        opacity: 0.9,
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      };
    }

    if (draggedIndex > index && index >= draggedClient()) {
      return {
        transform: "translate3d(0, 40px, 0)",
        transition: "transform 0.3s ease-in-out",
      };
    }

    if (draggedClient() > index && index >= draggedIndex) {
      return {
        transform: "translate3d(0, -40px, 0)",
        transition: "transform 0.3s ease-in-out",
      };
    }

    return {
      transform: "translate3d(0, 0, 0)",
      transition: "transform 0.3s ease-in-out",
    };
  };

  createEffect(() => {
    const animationSequence = async () => {
      await animateDrag(3, 0);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await animateDrag(2, 0);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await animateDrag(4, 1);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await animateDrag(3, 2);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    animationSequence();
    const intervalId = setInterval(animationSequence, 15000);

    onCleanup(() => clearInterval(intervalId));
  });

  return (
    <div class="client-list-animation bg-white rounded-lg shadow-md p-4 overflow-hidden h-full relative">
      <h3 class="text-lg font-semibold mb-4">Client Waitlist</h3>
      <div class="relative overflow-hidden" style={{ height: "200px" }}>
        <div class="absolute top-0 left-0 right-0 h-[140px] border-2 border-purple-300 rounded-lg pointer-events-none z-10"></div>
        <ul ref={containerRef} class="space-y-2 relative z-0">
          <For each={clients()}>
            {(client, index) => (
              <li
                class="flex items-center justify-between p-2 bg-gray-100 rounded transition-all duration-300 ease-in-out"
                style={getItemStyle(index())}
              >
                <div class="flex items-center">
                  <GripVertical class="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.name}</span>
                </div>
                <span
                  class={`px-2 py-1 rounded text-xs ${
                    client.priority === "High"
                      ? "bg-red-200 text-red-800"
                      : client.priority === "Medium"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                  }`}
                >
                  {client.priority}
                </span>
              </li>
            )}
          </For>
        </ul>
      </div>
      <div
        ref={cursorRef}
        class="absolute w-6 h-6 border-2 border-purple-500 rounded-full transition-all duration-100 ease-in-out pointer-events-none"
        style={{
          left: "50",
          top: "500",
          cursor: "grabbing",
          "background-color": "rgba(168, 85, 247, 0.2)",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
    </div>
  );
};

export default ClientListAnimation;
