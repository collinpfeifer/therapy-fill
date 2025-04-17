import { createSignal, onCleanup, createEffect, For } from "solid-js";

const messages = [
  {
    text: "Hi this is TherapyFill reaching out on behalf of Dr. Brenner, they have an opening at 2pm if you are available.",
    isOutgoing: true,
  },
  { text: "Yes I'm available, that would be perfect!", isOutgoing: false },
  {
    text: "Great! you should be receiving another message soon, see you then!",
    isOutgoing: true,
  },
];

const TextMessageAnimation = () => {
  const [visibleMessages, setVisibleMessages] = createSignal<number[]>([]);

  createEffect(() => {
    let timeouts: any[] = [];

    const animationCycle = () => {
      // Clear previous timeouts
      timeouts.forEach((timeout) => clearTimeout(timeout));
      setVisibleMessages([]);

      // Show messages one by one
      messages.forEach((_, index) => {
        const timeoutId = setTimeout(() => {
          setVisibleMessages((prev) => [...prev, index]);
        }, index * 2000);
        timeouts.push(timeoutId);
      });

      // Hide all messages after they've all been shown
      const resetTimeout = setTimeout(
        () => {
          setVisibleMessages([]);
        },
        (messages.length + 1) * 2000,
      );
      timeouts.push(resetTimeout);
    };

    animationCycle();
    const intervalId = setInterval(
      animationCycle,
      (messages.length + 2) * 2000,
    );

    onCleanup(() => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      clearInterval(intervalId);
    });
  });

  return (
    <div class="text-message-animation bg-white rounded-lg shadow-md p-4 overflow-hidden h-full">
      <div class="flex flex-col space-y-4">
        <For each={messages}>
          {(message, index) => (
            <div
              class={`message-container ${message.isOutgoing ? "outgoing" : "incoming"} ${
                visibleMessages().includes(index())
                  ? "opacity-100"
                  : "opacity-0"
              } transition-opacity duration-1000`}
            >
              <div
                class={`message p-3 rounded-lg max-w-[80%] ${
                  message.isOutgoing
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default TextMessageAnimation;
