import { For } from "solid-js";
import { A, createAsync } from "@solidjs/router";
import { gettherapists } from "~/api";

export const route = {
  preload: () => {
    gettherapists();
  },
};

export default function DashboardPage() {
  const therapists = createAsync(() => gettherapists());

  return (
    <div class="min-h-screen bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100 p-8">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      <div class="g-white p-6 rounded-lg shadow-md md:col-span-2">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">Therapists</h2>
        <For each={therapists()}>
          {(therapist) => (
            <A href={`/admin/${therapist.id}`} class="p-3 rounded-lg shadow-sm">
              <div class="flex justify-between items-center">
                <span>{therapist.name}</span>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  );
}
