import { createEffect, onCleanup } from "solid-js";

const clients = [
  {
    name: "Rebecca Smith",
    phoneNumber: "(555) 123-4567",
    email: "rebeccasmith@gmail.com",
    message: "I'm looking for help with anxiety.",
  },
  {
    name: "Michael Johnson",
    phoneNumber: "(555) 234-5678",
    email: "michaeljohnson@gmail.com",
    message: "I'm struggling with stress at work.",
  },
  {
    name: "Emily Davis",
    phoneNumber: "(555) 345-6789",
    email: "emilydavis12@yahoo.com",
    message: "I'm feeling overwhelmed and need guidance.",
  },
  {
    name: "Daniel Martinez",
    phoneNumber: "(555) 456-7890",
    email: "danielmartinezzzz@gmail.com",
    message: "I'm having difficulty with relationships.",
  },
];

const FormAnimation = () => {
  let nameRef!: HTMLInputElement;
  let phoneRef!: HTMLInputElement;
  let emailRef!: HTMLInputElement;
  let messageRef!: HTMLTextAreaElement;
  let buttonRef!: HTMLButtonElement;
  let cursorRef!: HTMLDivElement;

  const animateTyping = (
    element: HTMLInputElement | HTMLTextAreaElement,
    text: string,
  ) => {
    return new Promise<void>((resolve) => {
      let i = 0;
      const typing = setInterval(() => {
        if (i < text.length) {
          element.value += text.charAt(i);
          i++;
          if (element instanceof HTMLTextAreaElement) {
            element.style.height = "auto";
            element.style.height = element.scrollHeight + "px";
          }
        } else {
          clearInterval(typing);
          resolve();
        }
      }, 100);
    });
  };

  const moveCursor = (element: HTMLElement) => {
    if (cursorRef && element) {
      const rect = element.getBoundingClientRect();
      const parentRect = cursorRef.parentElement!.getBoundingClientRect();
      cursorRef.style.left = `${rect.left - parentRect.left + rect.width / 2}px`;
      cursorRef.style.top = `${rect.top - parentRect.top + rect.height / 2}px`;
    }
  };

  const animationSequence = async () => {
    if (nameRef && phoneRef && emailRef && messageRef && buttonRef) {
      nameRef.value = "";
      phoneRef.value = "";
      emailRef.value = "";
      messageRef.value = "";
      for (const { name, phoneNumber, email, message } of clients) {
        // Fill in all inputs
        moveCursor(nameRef);
        await animateTyping(nameRef, name);
        moveCursor(phoneRef);
        await animateTyping(phoneRef, phoneNumber);
        moveCursor(emailRef);
        await animateTyping(emailRef, email);
        moveCursor(messageRef);
        await animateTyping(messageRef, message);

        // Move cursor to the button and click it
        moveCursor(buttonRef);
        await new Promise((resolve) => setTimeout(resolve, 500));
        buttonRef.classList.add("active");
        await new Promise((resolve) => setTimeout(resolve, 200));
        buttonRef.classList.remove("active");
        buttonRef.classList.replace("bg-orange-500", "bg-green-500");
        buttonRef.textContent = "Success!";
        // Wait for 2 seconds before starting to backspace
        await new Promise((resolve) => setTimeout(resolve, 2000));
        nameRef.value = "";
        phoneRef.value = "";
        emailRef.value = "";
        messageRef.value = "";
        buttonRef.classList.replace("bg-green-500", "bg-orange-500");
        buttonRef.textContent = "Join Waitlist";
      }
    }
  };

  createEffect(async () => {
    await animationSequence();
    const intervalId = setInterval(animationSequence, 52000);
    onCleanup(() => clearInterval(intervalId));
  });

  return (
    <div class="form-animation bg-white rounded-lg shadow-md p-4 overflow-hidden h-full relative">
      <h3 class="text-lg font-semibold mb-4">Join Our Waitlist</h3>
      <form class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            ref={nameRef}
            type="text"
            id="name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 bg-white"
            readOnly
          />
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            ref={phoneRef}
            type="tel"
            id="phone"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 bg-white"
            readOnly
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 bg-white"
            readOnly
          />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            ref={messageRef}
            id="message"
            rows={1}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 resize-none bg-white"
            readOnly
          ></textarea>
        </div>
        <button
          ref={buttonRef}
          type="button"
          class="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
        >
          Join Waitlist
        </button>
      </form>
      <div
        ref={cursorRef}
        class="absolute w-6 h-6 border-2 border-orange-500 bg-orange-200 rounded-full transition-all duration-300 ease-in-out pointer-events-none"
        style={{
          left: 0,
          top: 0,
        }}
      ></div>
      <style jsx>{`
        .active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default FormAnimation;
