import { webkit } from "playwright";
import type { Page } from "playwright";
import { serve } from "bun";

const GOOGLE_EMAIL = process.env.GOOGLE_EMAIL!;
const GOOGLE_PASSWORD = process.env.GOOGLE_PASSWORD!;
const WEBHOOK_URL = process.env.WEBHOOK_URL!;
let page: Page;

// Launch Google Voice Automation
const startGoogleVoice = async () => {
  const browser = await webkit.launch({
    // headless: true,
    headless: false,
    // args: [
    //   // "--disable-blink-features=AutomationControlled",
    //   // "--window-size=1280,720",
    // ],
  });
  const context = await browser.newContext({
    storageState: "auth.json",
  });
  page = await context.newPage();

  console.log("Logging into Google Voice...");
  await page.goto("https://voice.google.com/signup");

  if (await page.isVisible('input[type="email"]')) {
    await page.fill('input[type="email"]', GOOGLE_EMAIL);
    await page.click("text=Next");
    await page.waitForTimeout(2000);
  }
  if (await page.isVisible('input[type="password"]')) {
    await page.fill('input[type="password"]', GOOGLE_PASSWORD);
    await page.click("text=Next");
    await page.waitForTimeout(5000);
  }

  console.log("Google Voice loaded.");
  // Stores context in a file that can be read
  await page.context().storageState({ path: "auth.json" });
  monitorIncomingTexts();
};

// Monitor incoming messages and send to a webhook
const monitorIncomingTexts = async () => {
  console.log("Monitoring incoming messages...");

  while (true) {
    await page.waitForTimeout(5000);

    const newMessages = await page.locator('div[data-e2e="message-row"]').all();
    if (newMessages.length > 0) {
      const latestMessage = newMessages[0];
      const sender = await latestMessage
        .locator('div[data-e2e="message-sender"]')
        .textContent();
      const messageText = await latestMessage
        .locator('div[data-e2e="message-content"]')
        .textContent();

      console.log(`New message from ${sender}: ${messageText}`);

      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, message: messageText }),
      }).catch((err) => {
        console.error("Webhook error:", err.message);
      });
    }
  }
};

// Function to send messages via Google Voice
const sendMessage = async (recipient: string, message: string) => {
  console.log(`Sending message to ${recipient}: ${message}`);

  await page.goto("https://voice.google.com/u/0/messages");
  await page.click('button[data-e2e="compose-button"]');
  await page.fill('input[data-e2e="recipient-input"]', recipient);
  await page.press('input[data-e2e="recipient-input"]', "Enter");

  await page.fill('textarea[data-e2e="message-input"]', message);
  await page.click('button[data-e2e="send-button"]');

  console.log(`Message sent to ${recipient}`);
};

// Bun server
serve({
  port: 3000,
  fetch: async (req) => {
    if (req.method === "POST" && req.url.endsWith("/send")) {
      try {
        const { recipient, message } = await req.json();
        if (!recipient || !message) {
          return new Response(
            JSON.stringify({ error: "Missing recipient or message" }),
            { status: 400 },
          );
        }

        await sendMessage(recipient, message);
        return new Response(JSON.stringify({ status: "Message sent" }), {
          status: 200,
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("Bun server running on http://localhost:3000");

// Start Google Voice automation
startGoogleVoice();
