import Header from "../components/landing-page/Header";
import Footer from "../components/landing-page/Footer";
import BentoGrid from "../components/landing-page/BentoGrid";
import CallToAction from "../components/landing-page/CallToAction";

export default function Home() {
  return (
    <div class="min-h-screen flex flex-col bg-white bg-emoji relative">
      <div class="z-10 flex flex-col min-h-screen">
        <Header />
        <main class="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl w-full space-y-16 text-center">
            <div>
              <h1 class="text-4xl font-bold text-stroke mb-4">
                From Empty Slots to Fully Booked — Effortlessly
              </h1>
              <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                Struggling with cancellations? Want to increase your earning
                capacity?
              </h2>
              <p class="text-xl text-gray-600">
                Maximize your schedule and income with our managed cancellation
                list for therapists.
              </p>
            </div>
            <BentoGrid />
            <CallToAction />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
