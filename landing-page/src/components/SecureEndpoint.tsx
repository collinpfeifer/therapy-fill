import { createSignal, createEffect, onCleanup, For } from "solid-js";

const SecureEndpoint = () => {
  // Animate the colored dots
  const [dots, setDots] = createSignal(0);
  // Colors for the dots
  const dotColors = [
    "bg-yellow-300",
    "bg-green-300",
    "bg-pink-300",
    "bg-orange-300",
    "bg-purple-300",
  ];

  // Maximum number of dots before resetting
  const maxDots = dotColors.length;
  createEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev >= maxDots - 1 ? 0 : prev + 1));
    }, 800);

    return () => clearInterval(interval);
  }, [maxDots]);

  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div class="text-center">
          <h1 class="mb-4 text-xl font-bold text-gray-900">
            Redirecting to a secure endpoint
          </h1>
          <p class="mb-6 text-gray-600">
            Please wait while we redirect you to our HIPAA compliant endpoint
          </p>
          <div class="flex justify-center mb-8">
            <div class="flex items-center gap-3">
              <For each={dotColors}>
                {(color, index) => (
                  <div
                    class={`h-4 w-4 rounded-full transition-all duration-300 ${
                      index() <= dots() ? color : "bg-gray-100"
                    } ${index() === dots() ? "scale-125" : "scale-100"}`}
                  />
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureEndpoint;
