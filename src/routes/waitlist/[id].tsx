import { createSignal } from "solid-js";
import { useParams, useAction } from "@solidjs/router";
import { addclienttowaitlist } from "~/api";
import { Button } from "~/components/ui/button";
import {
  TextFieldRoot,
  TextField,
  TextFieldLabel,
} from "~/components/ui/textfield";
import { TextArea } from "~/components/ui/textarea";
import { toaster } from "@kobalte/core";
import {
  Toast,
  ToastContent,
  ToastDescription,
  ToastProgress,
  ToastTitle,
} from "~/components/ui/toast";

export default function WaitlistForm() {
  const params = useParams();
  const addClientToWaitlist = useAction(addclienttowaitlist);
  const [formData, setFormData] = createSignal({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
    id: params.id,
  });

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    console.log("Form submitted:", formData());
    console.log(await addClientToWaitlist(formData()));
    toaster.show((props) => (
      <Toast toastId={props.toastId}>
        <ToastContent>
          <ToastTitle>Submission Successful</ToastTitle>
          <ToastDescription>
            You've been added to the waitlist. We'll contact you soon.
          </ToastDescription>
        </ToastContent>
        <ToastProgress />
      </Toast>
    ));
    setFormData({ name: "", email: "", phoneNumber: "", message: "", id: "" });
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100 p-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Join the Waitlist</h1>
        <form onSubmit={handleSubmit} class="space-y-4">
          <TextFieldRoot>
            <TextFieldLabel for="name">Name</TextFieldLabel>
            <TextField
              id="name"
              name="name"
              value={formData().name}
              onInput={handleChange}
              required
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="email">Email</TextFieldLabel>
            <TextField
              id="email"
              name="email"
              type="email"
              value={formData().email}
              onInput={handleChange}
              required
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="phoneNumber">Phone Number</TextFieldLabel>
            <TextField
              id="phone"
              name="phone"
              type="tel"
              value={formData().phoneNumber}
              onInput={handleChange}
              required
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="message">
              Why are you seeking therapy?
            </TextFieldLabel>
            <TextArea
              id="message"
              name="message"
              rows={2}
              value={formData().message}
              onInput={handleChange}
              required
            />
          </TextFieldRoot>
          <Button
            type="submit"
            class="w-full bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300"
          >
            Join Waitlist
          </Button>
        </form>
      </div>
    </div>
  );
}
