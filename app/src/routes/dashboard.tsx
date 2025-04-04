import { For } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { createAsync } from "@solidjs/router";
import { getclients, getappointments } from "~/api";
//Components
import { Calendar } from "~/components/ui/calendar";
import CancellationPhoneNumber from "~/components/dashboard/CancellationPhoneNumber";
import { formatAppointmentTime } from "~/lib/date";
import { getUser } from "~/api/therapist.server";
// const CancellationListLink = clientOnly(
//   () => import("~/components/dashboard/CancellationListLink"),
// );
import CancellationListLink from "~/components/dashboard/CancellationListLink";

export const route = {
  preload: () => {
    getclients();
    getappointments();
  },
};

export default function DashboardPage() {
  const clients = createAsync(() => getclients());
  const appointments = createAsync(() => getappointments());
  const therapist = createAsync(() => getUser());

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
            {/* <For each={appointments()}>
              {(appointment) => (
                <li class="bg-gray-100 p-2 rounded">
                  {formatAppointmentTime(appointment.dateTime)}
                </li>
              )}
            </For> */}

            <li class="bg-gray-100 p-2 rounded">
              {formatAppointmentTime(
                new Date(2025, 1, 26, 14, 0, 0).toISOString(),
              )}
              {/* <div class="ml-4 inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-orange-500 rounded-full shadow-sm">
                Looking...
              </div> */}
              <div class="ml-4 inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full shadow-sm">
                Filled!
              </div>
              <div class="ml-4 inline-flex items-center justify-center px-3 py-1 text-sm font-medium">
                New Client: Kenzie Ma
              </div>
            </li>
          </ul>
        </div>

        {/* <div class="g-white p-6 rounded-lg shadow-md md:col-span-2">
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
        </div> */}
      </div>
      {/* <CancellationListLink id={therapist()!.cancellationListId} /> */}
      <CancellationListLink id="9f3acd6d-0d7a-4a16-b137-3b1d89064851" />
      <CancellationPhoneNumber />
    </div>
  );
}
