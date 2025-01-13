import { ShieldCheck } from "lucide-solid";

export default function Footer() {
  return (
    <footer class="py-6 bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100 mt-6">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
        <p>
          &copy; 2023 TherapyFill. All rights reserved.
          <span class="font-semibold flex items-center justify-center">
            <ShieldCheck class="w-4 h-4 mr-1" /> HIPAA Compliant
          </span>
        </p>
      </div>
    </footer>
  );
}
