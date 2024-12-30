import { createSignal, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { signinorsignup } from "~/api";

// Components
import { Button } from "~/components/ui/button";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function AuthPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [activeTab, setActiveTab] = createSignal("sign-in");
  const [searchParams] = useSearchParams();

  onMount(() => {
    const tab = searchParams.tab;
    if (tab === "sign-up") {
      setActiveTab("sign-up");
    }
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100">
      <div class="w-full max-w-md">
        <Tabs value={activeTab()} onChange={setActiveTab} class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <form
              action={signinorsignup}
              method="post"
              class="space-y-4 bg-white p-8 rounded-lg shadow-md"
            >
              <TextFieldRoot class="space-y-2">
                <TextFieldLabel for="email">Email</TextFieldLabel>
                <TextField
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email()}
                  onInput={(e) => setEmail(e.target.value)}
                  required
                />
              </TextFieldRoot>
              <TextFieldRoot class="space-y-2">
                <TextFieldLabel for="password">Password</TextFieldLabel>
                <TextField
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password()}
                  onInput={(e) => setPassword(e.target.value)}
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
          </TabsContent>
          <TabsContent value="sign-up">
            <form
              action={signinorsignup}
              method="post"
              class="space-y-4 bg-white p-8 rounded-lg shadow-md"
            >
              <TextFieldRoot class="space-y-2">
                <TextFieldLabel for="signup-email">Email</TextFieldLabel>
                <TextField
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email()}
                  onInput={(e) => setEmail(e.target.value)}
                  required
                />
              </TextFieldRoot>
              <TextFieldRoot class="space-y-2">
                <TextFieldLabel for="signup-password">Password</TextFieldLabel>
                <TextField
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={password()}
                  onInput={(e) => setPassword(e.target.value)}
                  required
                />
              </TextFieldRoot>
              <Button
                type="submit"
                class="w-full bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300"
              >
                Sign Up
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
