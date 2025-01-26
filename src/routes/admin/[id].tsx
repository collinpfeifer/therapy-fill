import { For, createSignal } from "solid-js";
import { A, createAsync, useAction, useParams } from "@solidjs/router";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Enable the plugin
dayjs.extend(customParseFormat);

import {
  getappointmentsbytherapistid,
  getclientsbytherapistid,
  addappointment,
  adminbookappointment,
} from "~/api";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CalendarArrowDown } from "lucide-solid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  TextField,
  TextFieldRoot,
  TextFieldLabel,
} from "~/components/ui/textfield";
import { formatAppointmentTime } from "~/lib/date";

export default function AdminDashboardPage() {
  const params = useParams();
  const clients = createAsync(() => getclientsbytherapistid(params.id));
  const appointments = createAsync(() =>
    getappointmentsbytherapistid(params.id),
  );
  const addAppointment = useAction(addappointment);
  // const adminBookAppointment = useAction(adminbookappointment);
  const [date, setDate] = createSignal<string>(dayjs().format("YYYY-MM-DD"));
  const [time, setTime] = createSignal<string>("09:00");
  const [from, setFrom] = createSignal<string>("");
  const [clientId, setClientId] = createSignal<string>("");

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? "00" : "30";
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minute} ${ampm}`;
  });

  // Generate date options for the next 30 days
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const date = dayjs().add(i + 1, "day");
    return date.format("YYYY-MM-DD");
  });

  const handleSubmit = async () =>
    await addAppointment({
      therapistId: params.id,
      dateTime: dayjs(
        `${date()} ${time()}`,
        "YYYY-MM-DD hh:mm A",
      ).toISOString(),
      From: from(),
    });

  // const handleBook = async (appointmentId: string) =>
  //   await adminBookAppointment({
  //     appointmentId,
  //     clientId: clientId(),
  //   });

  return (
    <Card class="min-h-screen bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100 p-8">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">
        Admin Dashboard for {params.id}
      </h1>
      <div class="g-white p-6 rounded-lg shadow-md md:col-span-2">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">Clients</h2>
        <For each={clients()}>
          {(client) => (
            <div class="p-3 rounded-lg shadow-sm text-gray-700">
              <div class="flex justify-between items-center">
                <span>{client.id}</span>
                <span>{client.name}</span>
                <span>{client.email}</span>
                <span>{client.phoneNumber}</span>
              </div>
            </div>
          )}
        </For>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-6">
        Schedule Appointment
      </h1>

      <div class="space-y-6 ">
        <div class="text-gray-700">
          <h2 class="text-lg font-semibold mb-2">Select Date</h2>
          <Select
            onChange={setDate}
            value={date()}
            placeholder="Select a date"
            color="black"
            options={dateOptions}
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
          >
            <Select.Trigger aria-label="Date">
              <Select.Value<string>>
                {(state) => state.selectedOption()}
              </Select.Value>
              <Select.Icon>
                <CalendarArrowDown />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content>
                <Select.Listbox />
              </Select.Content>
            </Select.Portal>
          </Select>
        </div>

        <div class="text-gray-700">
          <h2 class="text-lg font-semibold mb-2">Select Time</h2>
          <Select
            onChange={setTime}
            value={time()}
            color="black"
            placeholder="Select a time"
            options={timeSlots}
            itemComponent={(props) => (
              <SelectItem color="black" item={props.item}>
                {props.item.rawValue}
              </SelectItem>
            )}
          >
            <Select.Trigger aria-label="Time">
              <Select.Value<string>>
                {(state) => state.selectedOption()}
              </Select.Value>
              <Select.Icon>
                <CalendarArrowDown />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content>
                <Select.Listbox />
              </Select.Content>
            </Select.Portal>
          </Select>
        </div>

        <div class="text-gray-700">
          <TextFieldRoot>
            <TextFieldLabel for="from">From</TextFieldLabel>
            <TextField
              id="from"
              name="from"
              type="text"
              placeholder="Enter the number that texted"
              value={from()}
              onInput={(e) => setFrom((e.target as HTMLInputElement).value)}
              required
            />
          </TextFieldRoot>
        </div>

        <div class="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!date() || !time() || !from()}
            class="w-full bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300"
          >
            Add Appointment
          </Button>
        </div>
      </div>

      <div class="g-white p-6 rounded-lg shadow-md md:col-span-2">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">Appointments</h2>
        <For each={appointments()}>
          {(appointment) => (
            <div class="p-3 rounded-lg shadow-sm">
              <div class="flex justify-between items-center text-gray-700">
                <span color="black">
                  {formatAppointmentTime(appointment.dateTime)}
                </span>
                <form
                  class="text-gray-700"
                  action={adminbookappointment}
                  method="post"
                >
                  <TextFieldRoot>
                    <TextFieldLabel for="clientId">ClientId</TextFieldLabel>
                    <TextField
                      id="clientId"
                      name="clientId"
                      type="text"
                      placeholder="Enter the clientId that took the appointment"
                      // value={clientId()}
                      // onInput={(e) =>
                      //   setClientId((e.target as HTMLInputElement).value)
                      // }
                      required
                    />
                  </TextFieldRoot>
                  <input
                    type="hidden"
                    name="appointmentId"
                    value={appointment.id}
                  />
                  <Button type="submit">Book Appointment</Button>
                </form>
                <span>{appointment.from}</span>
              </div>
            </div>
          )}
        </For>
      </div>
    </Card>
  );
}
