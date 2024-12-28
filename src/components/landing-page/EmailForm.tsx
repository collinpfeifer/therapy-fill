import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";
import { addemail } from "~/api";

export default function EmailForm() {
  const [email, setEmail] = createSignal<string>("");
  const [message, setMessage] = createSignal<string>("");
  const [success, setSuccess] = createSignal<boolean>(false);
  const addEmail = useAction(addemail);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const result = await addEmail(email());
    setMessage(result.message);
    if (result.success) {
      setSuccess(true);
      setEmail("");
    }
  };

  return (
    <form onSubmit={handleSubmit} class="mt-8 space-y-6">
      <div class="rounded-md shadow-sm -space-y-px">
        <input
          type="email"
          required
          class="appearance-none rounded-md relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-200 transition duration-200 ease-in-out"
          placeholder="Enter your email"
          value={email()}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
        >
          Join the Beta!
        </button>
      </div>
      {message() && (
        <p
          class={`mt-2 text-sm ${success() ? "text-green-600" : "text-red-600"}`}
        >
          {message()}
        </p>
      )}
    </form>
  );
}
