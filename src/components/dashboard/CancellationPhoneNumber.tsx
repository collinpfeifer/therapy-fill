import { Phone } from "lucide-solid";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { formatPhoneNumber } from "~/lib/phoneNumber";

const CancellationPhoneNumber = () => {
  const [phoneNumber, setPhoneNumber] = createSignal(
    formatPhoneNumber(process.env.GOOGLE_VOICE_TWILIO_PHONE_NUMBER!),
  );
  return (
    <div class="bg-white p-6 rounded-lg shadow-md md:col-span-2 mt-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">
        Cancellation Phone Number
      </h2>
      <div class="flex items-center space-x-4">
        <div class="flex-grow flex items-center space-x-2 bg-gray-100 p-2 rounded">
          <Phone class="text-gray-500" />
          <span class="text-lg">{phoneNumber()}</span>
        </div>
        <Button
          onClick={() => navigator.clipboard.writeText(phoneNumber())}
          class="bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300"
        >
          Copy Number
        </Button>
      </div>
      <p class="mt-2 text-sm text-gray-600">
        Share this with your clients and they can text this number to cancel
        their appoinment while we start looking for a replacement.
      </p>
    </div>
  );
};

export default CancellationPhoneNumber;
