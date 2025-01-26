import { createStore } from "solid-js/store";
import { useParams, useAction } from "@solidjs/router";
import { addclienttocancellationlist } from "~/api";
import { Button } from "~/components/ui/button";
import {
  TextFieldRoot,
  TextField,
  TextFieldLabel,
} from "~/components/ui/textfield";
import { toaster } from "@kobalte/core";
import {
  Toast,
  ToastContent,
  ToastDescription,
  ToastProgress,
  ToastTitle,
} from "~/components/ui/toast";
import {
  Checkbox,
  CheckboxControl,
  CheckboxDescription,
  CheckboxLabel,
} from "~/components/ui/checkbox";

export default function WaitlistForm() {
  const params = useParams();
  const addClientToCancellationList = useAction(addclienttocancellationlist);
  const [formData, setFormData] = createStore({
    name: "",
    email: "",
    phoneNumber: "",
    textConsent: false,
    id: params.id,
  });

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ [name]: value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const response = await addClientToCancellationList({
      id: formData.id,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      textConsent: formData.textConsent,
    });
    if (response.success) {
      toaster.show((props) => (
        <Toast toastId={props.toastId} class="bg-green-100 text-green-800">
          <ToastContent>
            <ToastTitle>Submission Successful</ToastTitle>
            <ToastDescription>
              You've been added to the cancellation list. We'll contact you
              soon.
            </ToastDescription>
          </ToastContent>
          <ToastProgress />
        </Toast>
      ));
    } else {
      toaster.show((props) => (
        <Toast toastId={props.toastId} class="bg-red-100 text-red-800">
          <ToastContent>
            <ToastTitle>Submission Failed</ToastTitle>
            <ToastDescription>
              There was an error submitting your information. Please try again.
            </ToastDescription>
          </ToastContent>
          <ToastProgress />
        </Toast>
      ));
    }
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      id: "",
      textConsent: false,
    });
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100 p-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">
          Join the Cancellation List
        </h1>
        <form onSubmit={handleSubmit} class="space-y-4">
          <TextFieldRoot>
            <TextFieldLabel for="name">Name</TextFieldLabel>
            <TextField
              id="name"
              name="name"
              value={formData.name}
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
              value={formData.email}
              onInput={handleChange}
              required
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="phoneNumber">Phone Number</TextFieldLabel>
            <TextField
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onInput={handleChange}
              required
            />
          </TextFieldRoot>
          <Checkbox
            id="textConsent"
            name="textConsent"
            class="flex items-start space-x-2"
            checked={formData.textConsent}
            onChange={(checked) => setFormData({ textConsent: checked })}
          >
            <CheckboxControl />
            <div class="grid gap-1.5 leading-none">
              <CheckboxLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Accept terms and conditions
              </CheckboxLabel>
              <CheckboxDescription class="text-sm text-muted-foreground">
                By checking this button, you agree to receive texts and emails
                from TherapyFill. We will use this to reach out about available
                appointments. Reply STOP to unsubscribe. Message and data rates
                may apply.
              </CheckboxDescription>
            </div>
          </Checkbox>
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
