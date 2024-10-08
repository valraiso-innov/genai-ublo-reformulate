import OpenAI from "openai";
import llmApiReturn from "@/utils/llm-api-return";

type Payload = {
  selection: string;
  model: string;
  provider: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const startDate = new Date();
  try {
    const { selection, model , provider} = (await req.json()) as Payload;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are a redaction assistant bot. You try to improve messages from a customer service to its customers.
          Given a text, you must improve and rephrase it in a more formal and welcoming. Give the text in french. 
          Don't add information or content, just stick with the original text
`,
        },
        { role: "user", content: selection },
      ],
    });
    return llmApiReturn(completion, model, startDate, provider);
  } catch (e) {
    console.log(e);
    return new Response((e as Error).message, { status: 500 });
  }
}
