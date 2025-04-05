import { serve } from "bun";
import { ChatOllama } from "@langchain/ollama";
import { Tool } from "@langchain/core/tools";

const GOOGLE_VOICE_API = process.env.GOOGLE_VOICE_API!;
const OLLAMA_URL = "http://localhost:11434/api/generate";

class SendMessageTool extends Tool {
  name = "sendMessage";
  description = "Send a message via Google Voice. Requires {recipient: string, message: string}.";

  async _call({ recipient, message }: { recipient: string; message: string }) {
    console.log(`AI wants to send message to ${recipient}: ${message}`);

    await fetch(`${GOOGLE_VOICE_API}/send`, {
    method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   recipient,
   message
  })
}).catch(err => {
      console.error("Error sending message:", err.message);
    });

    return "Message sent.";
  }
}

// LangChain LLaMA Model
const model = new ChatOllama({
  basePath: "http://localhost:11434",
  model: "llama3.2",
  tools: [new SendMessageTool()],
});

async function handleMessage(sender: string, message: string) {
  console.log(`Received message from ${sender}: ${message}`);

  const response = await model.invoke({
    input: `You received a message from ${sender}: "${message}". If a response is needed, call sendMessage({recipient: '${sender}', message: '<your response>'}).`,
  });

  console.log("AI Response:", response);
}

// Bun server webhook
serve({
  port: 4000,
  fetch: async (req) => {
    if (req.method === "POST" && req.url.endsWith("/webhook")) {
      try {
        const { sender, message } = await req.json();
        if (!sender || !message) return new Response("Missing data", { status: 400 });

        handleMessage(sender, message);
        return new Response("OK", { status: 200 });
      } catch (error) {
        return new Response("Invalid request", { status: 400 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("SMS Agent running on http://localhost:4000");
