import { createSignal, onMount, For } from "solid-js";
import { clientOnly } from "@solidjs/start";

//Components
import { Calendar } from "~/components/ui/calendar";
import CancellationPhoneNumber from "~/components/dashboard/CancellationPhoneNumber";
const CancellationListLink = clientOnly(
  () => import("~/components/dashboard/CancellationListLink"),
);

type TimeSlot = {
  start: string;
  end: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
};

export default function DashboardPage() {
  const [availableSlots, setAvailableSlots] = createSignal<TimeSlot[]>([]);
  const [waitlistClients, setWaitlistClients] = createSignal<Client[]>([]);

  onMount(() => {
    // Simulate fetching available slots
    const slots: TimeSlot[] = [
      { start: "9:00 AM", end: "10:00 AM" },
      { start: "10:00 AM", end: "11:00 AM" },
      { start: "1:00 PM", end: "2:00 PM" },
      { start: "2:00 PM", end: "3:00 PM" },
      { start: "3:00 PM", end: "4:00 PM" },
    ];
    setAvailableSlots(slots);

    // Simulate fetching waitlist clients
    const clients: Client[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        phoneNumber: "123-456-7890",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phoneNumber: "987-654-3210",
      },
      {
        id: "3",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phoneNumber: "555-123-4567",
      },
      {
        id: "4",
        name: "Bob Brown",
        email: "bob.brown@example.com",
        phoneNumber: "555-987-6543",
      },
      {
        id: "5",
        name: "Charlie Davis",
        email: "charlie.davis@example.com",
        phoneNumber: "555-321-7654",
      },
    ];
    setWaitlistClients(clients);
  });

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
            <For each={availableSlots()}>
              {(slot) => (
                <li class="bg-gray-100 p-2 rounded">
                  {slot.start} - {slot.end}
                </li>
              )}
            </For>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 class="text-2xl font-semibold mb-4 text-gray-700">
            Cancellation List Clients
          </h2>
          <For each={waitlistClients()}>
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
