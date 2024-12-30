import { createSignal, onMount, For } from "solid-js";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  DragDropProvider,
  DragDropSensors,
  useDragDropContext,
  createDraggable,
  createDroppable,
} from "@thisbeyond/solid-dnd";

type TimeSlot = {
  start: string;
  end: string;
};

type Client = {
  id: string;
  name: string;
  priority: "High" | "Medium" | "Low";
};

const Draggable = (props) => {
  const draggable = createDraggable(props.id);
  return <div use:draggable>draggable</div>;
};

const Droppable = (props) => {
  const droppable = createDroppable(props.id);
  return <div use:droppable>droppable</div>;
};

export default function DashboardPage() {
  const [isCalendarConnected, setIsCalendarConnected] = createSignal(false);
  const [availableSlots, setAvailableSlots] = createSignal<TimeSlot[]>([]);
  const [waitlistClients, setWaitlistClients] = createSignal<Client[]>([]);
  const [, { onDragEnd }] = useDragDropContext();

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
      { id: "1", name: "Alice Johnson", priority: "High" },
      { id: "2", name: "Bob Smith", priority: "Medium" },
      { id: "3", name: "Carol Williams", priority: "Low" },
      { id: "4", name: "David Brown", priority: "High" },
      { id: "5", name: "Eva Davis", priority: "Medium" },
    ];
    setWaitlistClients(clients);
  });

  const handleCalendarConnect = () => {
    // Simulate connecting to Google Calendar
    setIsCalendarConnected(true);
  };

  onDragEnd(({ draggable, droppable }) => {
    if (!droppable) return;

    const newClients = [...waitlistClients()];
    const [reorderedItem] = newClients.splice(draggable.index, 1);
    newClients.splice(droppable.index, 0, reorderedItem);

    setWaitlistClients(newClients);
  });

  return (
    <div class="min-h-screen bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100 p-8">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">Therapist Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-4 text-gray-700">
            Calendar Connection
          </h2>
          {isCalendarConnected() ? (
            <p class="text-green-600">Your Google Calendar is connected!</p>
          ) : (
            <Button
              onClick={handleCalendarConnect}
              class="bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300"
            >
              Connect Google Calendar
            </Button>
          )}
          <div class="mt-4">
            <Calendar
            // mode="single"
            // class="rounded-md border"
            />
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
            Waitlist Clients
          </h2>
          <DragDropProvider>
            <DragDropSensors>
              {/* <DragDropContext onDragEnd={onDragEnd}> */}
              <Droppable id="waitlist">
                {(dropProps) => (
                  <ul
                    ref={dropProps.ref}
                    {...dropProps.droppableProps}
                    class="space-y-2"
                  >
                    <For each={waitlistClients()}>
                      {(client, index) => (
                        <Draggable id={client.id} index={index}>
                          {(dragProps) => (
                            <li
                              ref={dragProps.ref}
                              {...dragProps.draggableProps}
                              {...dragProps.dragHandleProps}
                              class={`p-3 rounded-lg shadow-sm ${
                                index() < 3 ? "bg-yellow-100" : "bg-gray-100"
                              }`}
                            >
                              <div class="flex justify-between items-center">
                                <span>{client.name}</span>
                                <span
                                  class={`px-2 py-1 rounded text-xs ${
                                    client.priority === "High"
                                      ? "bg-red-200 text-red-800"
                                      : client.priority === "Medium"
                                        ? "bg-yellow-200 text-yellow-800"
                                        : "bg-green-200 text-green-800"
                                  }`}
                                >
                                  {client.priority}
                                </span>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      )}
                    </For>
                  </ul>
                )}
              </Droppable>
              {/* </DragDropContext> */}
            </DragDropSensors>
          </DragDropProvider>
        </div>
      </div>
    </div>
  );
}
