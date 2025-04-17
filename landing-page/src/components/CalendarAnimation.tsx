const CalendarAnimation = () => {
  return (
    <div class="calendar-animation relative w-full h-full bg-white rounded-lg shadow-md overflow-hidden">
      <div class="calendar-header bg-blue-500 text-white p-2 text-center">
        Monday, June 5
      </div>
      <div class="calendar-body p-2">
        <div class="appointment mb-2 p-2 bg-gray-100 rounded">
          9:00 AM - John Doe
        </div>
        <div class="appointment mb-2 p-2 bg-gray-100 rounded">
          11:00 AM - Jane Smith
        </div>
        <div class="empty-slot mb-2 p-2 bg-yellow-100 rounded">
          2:00 PM - 3:00 PM
          <span class="block text-sm text-gray-500">Available</span>
        </div>
        <div class="new-appointment mb-2 p-2 bg-green-100 rounded opacity-0 absolute top-[108px] left-2 right-2">
          2:00 PM - 3:00 PM
          <span class="block font-semibold">Rebecca Smith</span>
        </div>
        <div class="appointment mb-2 p-2 bg-gray-100 rounded">
          4:00 PM - Mike Johnson
        </div>
      </div>
      {/* <style jsx>{`
        @keyframes fillSlot {
          0%,
          40% {
            opacity: 0;
          }
          50%,
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes fadeSlot {
          0%,
          40% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }

        .empty-slot {
          animation: fadeSlot 6s infinite;
        }

        .new-appointment {
          animation: fillSlot 6s infinite;
          top: 144px;
          left: 8px;
          right: 8px;
          z-index: 10;
        }
      `}</style> */}
    </div>
  );
};

export default CalendarAnimation;
