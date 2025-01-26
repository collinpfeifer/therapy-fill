import { Button } from "~/components/ui/button";
import { TextFieldRoot, TextField } from "~/components/ui/textfield";

const CancellationListLink = ({ id }: { id: string | null }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/cancellationlist/${id}`,
    );
  };

  return (
    <div class="bg-white p-6 rounded-lg shadow-md md:col-span-2 mt-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">
        Your Cancellation List Form
      </h2>
      <TextFieldRoot class="flex items-center space-x-4">
        <TextField
          value={`${window.location.origin}/waitlist/${id}`}
          readOnly
        />
        <Button
          onClick={copyToClipboard}
          class="bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300"
        >
          Copy Link
        </Button>
      </TextFieldRoot>
      <p class="mt-2 text-sm text-gray-600">
        Share this link with your clients to join your cancellation list, and
        stay organized!
      </p>
      <div class="mt-4">
        <a href={`/cancellationlist/${id}`} target="_blank">
          <Button class="bg-gradient-to-r from-yellow-200 via-green-200 to-pink-200 text-gray-800 hover:from-yellow-300 hover:via-green-300 hover:to-pink-300">
            View Cancellation List Form
          </Button>
        </a>
      </div>
    </div>
  );
};

export default CancellationListLink;
