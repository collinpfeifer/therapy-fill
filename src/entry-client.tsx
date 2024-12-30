// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { posthog } from "posthog-js";

// Initialize PostHog
posthog.init("YOUR_POSTHOG_API_KEY", {
  api_host: "https://app.posthog.com", // Or your self-hosted PostHog URL
});

// Optionally, enable debugging in development
if (import.meta.env.MODE === "development") {
  posthog.debug();
}

mount(() => <StartClient />, document.getElementById("app")!);
