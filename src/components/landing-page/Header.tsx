import { Button } from "~/components/ui/button";
import { A } from "@solidjs/router";

export default function Header() {
  return (
    <header class="py-6">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-center text-gray-800 gradient-outline">
          TherapyFill
        </h2>
        <div class="space-x-4">
          <Button
            variant="outline"
            class="bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300"
          >
            <A href="/auth">Log In</A>
          </Button>
          <Button class="bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300">
            <A href="/auth?tab=sign-up">Sign Up</A>
          </Button>
        </div>
      </div>
    </header>
  );
}
