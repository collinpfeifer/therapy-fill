import { Calendar, Phone, DollarSign, CheckCircle } from "lucide-solid";

export default function FeatureList() {
  return (
    <div class="mt-12 grid gap-8 md:grid-cols-2">
      <div class="flex items-start">
        <Calendar class="flex-shrink-0 h-6 w-6 text-green-500 mr-3" />
        <div>
          <h3 class="text-lg font-medium text-gray-900">Calendar Sync</h3>
          <p class="mt-2 text-base text-gray-500">
            Automatically syncs with your calendar to detect cancellations and
            open slots.
          </p>
        </div>
      </div>
      <div class="flex items-start">
        <Phone class="flex-shrink-0 h-6 w-6 text-blue-500 mr-3" />
        <div>
          <h3 class="text-lg font-medium text-gray-900">
            Work Phone Integration
          </h3>
          <p class="mt-2 text-base text-gray-500">
            Integrates with your work phone to manage communications
            efficiently.
          </p>
        </div>
      </div>
      <div class="flex items-start">
        <CheckCircle class="flex-shrink-0 h-6 w-6 text-yellow-500 mr-3" />
        <div>
          <h3 class="text-lg font-medium text-gray-900">Automatic Outreach</h3>
          <p class="mt-2 text-base text-gray-500">
            Instantly reaches out to people on your cancellation list to fill
            open spots.
          </p>
        </div>
      </div>
      <div class="flex items-start">
        <DollarSign class="flex-shrink-0 h-6 w-6 text-pink-500 mr-3" />
        <div>
          <h3 class="text-lg font-medium text-gray-900">
            Pay Only for Results
          </h3>
          <p class="mt-2 text-base text-gray-500">
            It's free to use! You only pay when we successfully find a client to
            fill a cancelled spot.
          </p>
        </div>
      </div>
    </div>
  );
}
