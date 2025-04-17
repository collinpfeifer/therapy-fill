import { Button } from "./ui/button";
import { A } from "@solidjs/router";

export default function CallToAction() {
  return (
    <div class="bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100 p-8 rounded-lg shadow-md mb-8">
      <h2 class="text-3xl font-bold mb-4 text-gray-800">
        Ready to Optimize Your Practice?
      </h2>
      <p class="text-xl text-gray-700 mb-6">
        Join our beta and start filling those empty slots today!
      </p>
      <Button class="text-gray-800">
        <A href="https://cal.com/cpfeifer/10min" target="_blank">
          Sign Up
        </A>
      </Button>
    </div>
  );
}
