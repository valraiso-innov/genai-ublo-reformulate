import OpenAI from "openai";
import llmApiReturn from "@/utils/llm-api-return";

type Payload = {
  messages: Message[];
  model: string;
  provider: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const startDate = new Date();
  try {
    const { messages, model , provider} = (await req.json()) as Payload;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    });
    return llmApiReturn(completion, model, startDate, provider);
  } catch (e) {
    console.log(e);
    return new Response((e as Error).message, { status: 500 });
  }
}
