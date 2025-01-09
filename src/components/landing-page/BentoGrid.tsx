import { For } from "solid-js";
import { clientOnly } from "@solidjs/start";
import {
  Calendar,
  MessageCircle,
  DollarSign,
  Users,
  FormInput,
} from "lucide-solid";
import CalendarAnimation from "./CalendarAnimation";
import ClientListAnimation from "./ClientListAnimation";
import TextMessageAnimation from "./TextMessageAnimation";
const RevenueAnimation = clientOnly(() => import("./RevenueAnimation"));
import FormAnimation from "./FormAnimation";

const features = [
  {
    title: "Smart Scheduling",
    description:
      "Our AI-powered receptionist automatically detects cancellations and suggests perfect replacements from your waitlist. Therapists always have the final say in adding new clients, ensuring full control over their schedule.",
    icon: Calendar,
    color: "bg-yellow-200",
    animation: CalendarAnimation,
  },
  {
    title: "Automated Outreach",
    description:
      "Our system automatically reaches out to clients about available appointments, saving therapists valuable time on scheduling. It handles all communication, from initial contact to confirmation, streamlining the entire process.",
    icon: MessageCircle,
    color: "bg-green-200",
    animation: TextMessageAnimation,
  },
  {
    title: "Increased Revenue",
    description:
      "Fill those empty slots and boost your income by never missing an opportunity to see a client. Our system helps you maximize your earning potential by fielding cancelled appointments and finding clients that are available. The average therapist makes an extra $500/month.",
    icon: DollarSign,
    color: "bg-pink-200",
    animation: RevenueAnimation,
  },
  // {
  //   title: "Client Management",
  //   description:
  //     "Easily manage your waitlist and prioritize clients based on urgency or preference. Get a daily review to see the top 3 potential clients for that day and be able to prepare your practice.",
  //   icon: Users,
  //   color: "bg-purple-200",
  //   animation: ClientListAnimation,
  // },
  {
    title: "Self-Service Waitlist",
    description:
      "Provide a simple, managed form for clients to add themselves to your cancellation list or waitlist. Streamline your intake process and capture potential clients effortlessly.",
    icon: FormInput,
    color: "bg-orange-200",
    animation: FormAnimation,
  },
];

export default function BentoGrid() {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <For each={features}>
        {(feature, index) => (
          <>
            {index() % 2 === 0 ? (
              <>
                <div class={`p-6 rounded-lg shadow-md ${feature.color}`}>
                  <feature.icon class="w-12 h-12 mb-4 text-gray-800" />
                  <h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p class="text-gray-700">{feature.description}</p>
                </div>
                <div class="h-64 md:h-auto">
                  <feature.animation />
                </div>
              </>
            ) : (
              <>
                <div class="h-64 md:h-auto">
                  <feature.animation />
                </div>
                <div class={`p-6 rounded-lg shadow-md ${feature.color}`}>
                  <feature.icon class="w-12 h-12 mb-4 text-gray-800" />
                  <h3 class="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p class="text-gray-700">{feature.description}</p>
                </div>
              </>
            )}
          </>
        )}
      </For>
    </div>
  );
}
