import Header from "~/components/Header";
import EmailForm from "~/components/EmailForm";
import Footer from "~/components/Footer";
import FeatureList from "~/components/FeatureList";

export default function Home() {
  return (
    <div class="min-h-screen flex flex-col bg-white bg-emoji relative">
      <div class="z-10 flex flex-col min-h-screen">
        <Header />
        <main class="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl w-full space-y-8 text-center">
            <h1 class="text-4xl font-bold gradient-text">
              Never Miss a Session
            </h1>
            <p class="text-xl text-gray-600">
              Maximize your schedule and income with our managed cancellation
              list for therapists.
            </p>
            <EmailForm />
            <FeatureList />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
