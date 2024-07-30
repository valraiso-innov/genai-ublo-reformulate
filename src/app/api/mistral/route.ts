import MistralClient from "@mistralai/mistralai";
import gptAPIReturn from "@/utils/gpt-api-return";

type Payload = {
  messages: Message[];
  model: string;
};

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const { messages, model } = (await req.json()) as Payload;

    const client = new MistralClient(process.env.MISTRAL_API_KEY);
    const completion = await client.chat({
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
