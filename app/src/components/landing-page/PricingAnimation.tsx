import { createSignal, onCleanup, createEffect } from "solid-js";
import { DollarSign } from "lucide-solid";

const PricingAnimation = () => {
  const [filledSpots, setFilledSpots] = createSignal(0);
  const [moneySpent, setMoneySpent] = createSignal(0);
  const [extraRevenue, setExtraRevenue] = createSignal(0);

  const animateValue = (
    setter: (value: number) => void,
    start: number,
    end: number,
    duration: number,
  ) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setter(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const animationCycle = () => {
    setFilledSpots(0);
    setMoneySpent(0);
    setExtraRevenue(0);

    animateValue(setFilledSpots, 0, 4, 5000);
    animateValue(setMoneySpent, 0, 20, 5000);
    animateValue(setExtraRevenue, 0, 500, 5000);

    setTimeout(() => {
      setFilledSpots(0);
      setMoneySpent(0);
      setExtraRevenue(0);
    }, 8000);
  };

  // Run animation cycle on component mount and set interval
  createEffect(() => {
    animationCycle();
    const cycleInterval = setInterval(animationCycle, 8000);

    // Cleanup interval on component unmount
    onCleanup(() => clearInterval(cycleInterval));
  });

  return (
    <div class="bg-white rounded-lg shadow-md p-4 h-full flex flex-col justify-center items-center">
      <div class="text-3xl font-bold mb-2">
        {filledSpots()} spots filled per week
      </div>
      <div class="text-xl flex items-center mb-2">
        <DollarSign class="w-6 h-6 mr-1 text-red-500" />
        <span class="font-semibold">{moneySpent()} spent</span>
      </div>
      <div class="text-2xl flex items-center">
        <DollarSign class="w-7 h-7 mr-1 text-green-500" />
        <span class="font-semibold">{extraRevenue()} extra revenue</span>
      </div>
      <p class="mt-4 text-center text-gray-600">
        Pay only $5 per filled cancellation spot
      </p>
    </div>
  );
};

export default PricingAnimation;
