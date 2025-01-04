import { createSignal, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { signin, signup } from "~/api";

// Components
import { Button } from "~/components/ui/button";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Checkbox,
  CheckboxControl,
  CheckboxDescription,
  CheckboxLabel,
} from "~/components/ui/checkbox";

export default function AuthPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [name, setName] = createSignal("");
  const [textConsent, setTextConsent] = createSignal(false);
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
            <TabsTrigger value="sign-in">Login</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <form
              action={signin}
              method="post"
              class="space-y-4 bg-white p-8 rounded-lg shadow-md"
            >
              <TextFieldRoot class="space-y-2">
                <TextFieldLabel for="email">Email</TextFieldLabel>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email()}
                  onInput={(e) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
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
                  onInput={(e) =>
                    setPassword((e.target as HTMLInputElement).value)
                  }
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
              action={signup}
              method="post"
              class="space-y-4 bg-white p-8 rounded-lg shadow-md"
            >
              <TextFieldRoot class="space-y-2">
                <TextFieldLabel for="name">Name</TextFieldLabel>
                <TextField
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name, this is how we'll identify you if a client cancels"
                  value={name()}
                  onInput={(e) => setName((e.target as HTMLInputElement).value)}
                  required
                />
              </TextFieldRoot>
              <TextFieldRoot class="space-y-2">
                <TextFieldLabel for="email">Email</TextFieldLabel>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email()}
                  onInput={(e) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </TextFieldRoot>
              <TextFieldRoot class="space-y-2">
                <TextFieldLabel for="password">Password</TextFieldLabel>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={password()}
                  onInput={(e) =>
                    setPassword((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </TextFieldRoot>
              <Checkbox
                id="textConsent"
                name="textConsent"
                class="flex items-start space-x-2"
                checked={textConsent()}
                onChange={(checked) => setTextConsent(checked)}
              >
                <CheckboxControl />
                <div class="grid gap-1.5 leading-none">
                  <CheckboxLabel class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Accept terms and conditions
                  </CheckboxLabel>
                  <CheckboxDescription class="text-sm text-muted-foreground">
                    By providing your contact information, you agree to receive
                    texts and emails from TherapyFill. We will use this to reach
                    out about available appointments. Reply STOP to unsubscribe.
                    Message and data rates may apply.
                  </CheckboxDescription>
                </div>
              </Checkbox>
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
