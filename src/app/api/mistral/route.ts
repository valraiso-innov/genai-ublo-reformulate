import MistralClient from "@mistralai/mistralai";
import llmApiReturn from "@/utils/llm-api-return";

type Payload = {
  messages: Message[];
  model: string;
  provider: string;
};

export async function POST(req: Request) {
  const startDate = new Date();
  try {
    const { messages, model , provider} = (await req.json()) as Payload;

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
    return llmApiReturn(completion, model, startDate, provider);
  } catch (e) {
    console.log(e);
    return new Response((e as Error).message, { status: 500 });
  }
}
