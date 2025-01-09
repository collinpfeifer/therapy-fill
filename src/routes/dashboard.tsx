import { For } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { createAsync } from "@solidjs/router";
import { getclients, getappointments } from "~/api";
import dayjs from "dayjs";

//Components
import { Calendar } from "~/components/ui/calendar";
import CancellationPhoneNumber from "~/components/dashboard/CancellationPhoneNumber";
const CancellationListLink = clientOnly(
  () => import("~/components/dashboard/CancellationListLink"),
);

export const route = {
  preload: () => {
    getclients();
    getappointments();
  },
};

export default function DashboardPage() {
  const clients = createAsync(() => getclients());
  const appointments = createAsync(() => getappointments());

  return (
    <div class="min-h-screen bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100 p-8">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">Therapist Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-4 text-gray-700">Calendar</h2>
          <div class="mt-4">
            <Calendar />
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-4 text-gray-700">
            Available Slots
          </h2>
          <ul class="space-y-2">
            <For each={appointments()}>
              {(appointment) => {
                const dateTime = dayjs(appointment.dateTime);
                // Get the full date (e.g., "January 9, 2025")
                const date = dateTime.format("MMMM D, YYYY");

                // Get the time (e.g., "10:30 AM")
                const time = dateTime.format("h:mm A");

                // Get the time one hour later (e.g., "11:30 AM")
                const oneHourLater = dateTime.add(1, "hour").format("h:mm A");
                return (
                  <li class="bg-gray-100 p-2 rounded">
                    {date} - {time} - {oneHourLater}
                  </li>
                );
              }}
            </For>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 class="text-2xl font-semibold mb-4 text-gray-700">
            Cancellation List Clients
          </h2>
          <For each={clients()}>
            {(client) => (
              <div class="p-3 rounded-lg shadow-sm">
                <div class="flex justify-between items-center">
                  <span>{client.name}</span>
                  <span>{client.email}</span>
                  <span>{client.phoneNumber}</span>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
      <CancellationListLink />
      <CancellationPhoneNumber />
    </div>
  );
}
