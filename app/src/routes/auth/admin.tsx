import { createSignal } from "solid-js";
import { adminsignin } from "~/api";

// Components
import { Button } from "~/components/ui/button";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

export default function AuthPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100">
      <div class="w-full max-w-md">
        <form
          action={adminsignin}
          method="post"
          class="space-y-4 bg-white p-8 rounded-lg shadow-md"
        >
          <TextFieldRoot class="space-y-2">
            <TextFieldLabel for="email">Email</TextFieldLabel>
            <TextField
              id="email"
              name="email"
              // type="email"
              placeholder="Enter your email"
              value={email()}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              required
            />
          </TextFieldRoot>
          <TextFieldRoot class="space-y-2">
            <TextFieldLabel for="password">Password</TextFieldLabel>
            <TextField
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password()}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              required
            />
          </TextFieldRoot>
          <Button
            type="submit"
            class="w-full bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300"
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
}
