import posthog from "posthog-js";

// posthog.init("<ph_project_api_key>", {
//   api_host: "https://us.i.posthog.com",
// });

export default function NotFound() {
  return (
    <main class="w-full p-4 space-y-2">
      <h1 class="font-bold text-xl">Page Not Found</h1>
    </main>
  );
}
