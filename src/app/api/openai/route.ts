import OpenAI from "openai";
import gptAPIReturn from "@/utils/gpt-api-return";

type Payload = {
  messages: Message[];
  model: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const { messages, model } = (await req.json()) as Payload;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    });
    return gptAPIReturn(completion, model, startTime);
  } catch (e) {
    console.log(e);
    return new Response((e as Error).message, { status: 500 });
  }
}
