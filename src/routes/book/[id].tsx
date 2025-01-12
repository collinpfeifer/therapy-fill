import { createAsync, useParams, useAction, redirect } from "@solidjs/router";
import { getappointmentbynotificationid, bookappointment } from "~/api";
import { getTimeUntilStart } from "~/lib/date";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { toaster } from "@kobalte/core";
import {
  Toast,
  ToastContent,
  ToastDescription,
  ToastProgress,
  ToastTitle,
} from "~/components/ui/toast";
import dayjs from "dayjs";

export default function BookingForm() {
  const params = useParams();

  const appointment = createAsync(() =>
    getappointmentbynotificationid(params.id),
  );

  const bookAppointment = useAction(bookappointment);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    await bookAppointment({ notificationId: params.id });
    toaster.show((props) => (
      <Toast toastId={props.toastId}>
        <ToastContent>
          <ToastTitle>Successfully Booked!</ToastTitle>
          <ToastDescription>
            You've booked this appointment. We'll see you soon!
          </ToastDescription>
        </ToastContent>
        <ToastProgress />
      </Toast>
    ));
  };

  return (
    <Card class="bg-white shadow-md">
      <CardHeader>
        <CardTitle>{appointment()!.therapistName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-lg font-semibold">
          {dayjs(appointment()!.dateTime).format("MMMM d, yyyy")}
        </p>
        <p class="text-md">{dayjs(appointment()!.dateTime).format("h:mm a")}</p>
        <p class="text-sm text-gray-600">
          Starts in: {getTimeUntilStart(new Date(appointment()!.dateTime))}
        </p>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} method="post" class="space-y-4">
          <Button
            type="submit"
            class="w-full bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300"
          >
            Book Appointment
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
