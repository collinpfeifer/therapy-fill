import Header from "../components/landing-page/Header";
import Footer from "../components/landing-page/Footer";
import BentoGrid from "../components/landing-page/BentoGrid";

export default function Home() {
  return (
    <div class="min-h-screen flex flex-col bg-white bg-emoji relative">
      <div class="z-10 flex flex-col min-h-screen">
        <Header />
        <main class="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl w-full space-y-16 text-center">
            <div>
              <h1 class="text-4xl font-bold mb-4">Never Miss a Session</h1>
              <p class="text-xl text-gray-600">
                Maximize your schedule and income with our managed cancellation
                list for therapists.
              </p>
            </div>
            <BentoGrid />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
