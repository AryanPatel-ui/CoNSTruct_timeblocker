// Reference: javascript_openai integration
import OpenAI from "openai";

// Validate OpenAI API key is present
if (!process.env.OPENAI_API_KEY) {
  console.warn("Warning: OPENAI_API_KEY not set. AI features will not work.");
}

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy-key" });

export async function getAIResponse(message: string, context?: string): Promise<string> {
  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key") {
    return "AI features are currently unavailable. Please configure your OpenAI API key.";
  }

  try {
    const systemPrompt = `You are a helpful productivity and time management assistant. You help users organize their tasks, suggest time blocking strategies, and provide advice on maximizing productivity. ${context || ""}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_completion_tokens: 2048,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
}
