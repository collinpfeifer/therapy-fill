import { createSignal, onCleanup, createEffect, For } from "solid-js";

const messages = [
  {
    text: "Hi, I need to cancel my appointment for tomorrow at 2pm.",
    isOutgoing: false,
  },
  {
    text: "I understand. Would you like to reschedule for another time?",
    isOutgoing: true,
  },
  { text: "Yes, that would be great. Thank you.", isOutgoing: false },
  {
    text: "Great! We have openings on Thursday at 3pm and Friday at 11am. Which would you prefer?",
    isOutgoing: true,
  },
];

const ClientCancellationAnimation = () => {
  const [visibleMessages, setVisibleMessages] = createSignal<number[]>([]);

  const showMessages = () => {
    setVisibleMessages([]);
    messages.forEach((_, index) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, index]);
      }, index * 2000);
    });
  };

  // Run message animation cycle and set interval for restart
  createEffect(() => {
    showMessages();
    const intervalId = setInterval(showMessages, messages.length * 2000 + 2000);

    // Cleanup interval on component unmount
    onCleanup(() => clearInterval(intervalId));
  });

  return (
    <div class="text-message-animation bg-white rounded-lg shadow-md p-4 overflow-hidden h-64">
      <div class="flex flex-col space-y-2">
        <For each={messages}>
          {(message, index) => (
            <div
              class={`message-container ${message.isOutgoing ? "outgoing" : "incoming"} ${
                visibleMessages().includes(index())
                  ? "opacity-100"
                  : "opacity-0"
              } transition-opacity duration-300`}
            >
              <div
                class={`message p-2 rounded-lg max-w-[80%] text-sm ${
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

export default ClientCancellationAnimation;
