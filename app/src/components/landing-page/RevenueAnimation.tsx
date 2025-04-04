import { createSignal, onCleanup, For } from "solid-js";

const clients = [
  { name: "Alice Johnson", price: 150 },
  { name: "Bob Smith", price: 175 },
  { name: "Carol Williams", price: 200 },
  { name: "David Brown", price: 150 },
  { name: "Eva Davis", price: 175 },
];

const RevenueAnimation = () => {
  const [visibleClients, setVisibleClients] = createSignal<number[]>([]);
  const [totalRevenue, setTotalRevenue] = createSignal(0);

  const animateValue = (start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      setTotalRevenue(currentValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const animationCycle = () => {
    // Reset visible clients but keep the total revenue
    setVisibleClients([]);
    setTotalRevenue(0);
    let cumulativeRevenue = totalRevenue();
    // Show clients one by one
    clients.forEach((client, index) => {
      setTimeout(() => {
        setVisibleClients((prev) => [...prev, index]);
        const newTotal = cumulativeRevenue + client.price;
        animateValue(cumulativeRevenue, newTotal, 500);
        cumulativeRevenue = newTotal;
      }, index * 1000);
    });
  };

  // Start animation when component mounts and set interval for repeating animation
  onCleanup(() => clearInterval(intervalId));
  const intervalId = setInterval(animationCycle, (clients.length + 2) * 1000);
  animationCycle();

  return (
    <div class="revenue-animation bg-white rounded-lg shadow-md p-4 overflow-hidden h-full">
      <h3 class="text-lg font-semibold mb-4">Today's Sessions</h3>
      <ul class="space-y-2">
        <For each={clients}>
          {(client, index) => (
            <li
              class={`flex justify-between items-center p-2 bg-gray-100 rounded transition-opacity duration-300 ${
                visibleClients().includes(index()) ? "opacity-100" : "opacity-0"
              }`}
            >
              <span>{client.name}</span>
              <span class="text-green-600 font-semibold">${client.price}</span>
            </li>
          )}
        </For>
      </ul>
      <div class="mt-4 text-right">
        <span class="text-lg font-bold">Total: </span>
        <span class="text-2xl font-bold text-green-600">${totalRevenue()}</span>
      </div>
    </div>
  );
};

export default RevenueAnimation;
