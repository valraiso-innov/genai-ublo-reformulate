import MistralClient from "@mistralai/mistralai";
import llmApiReturn from "@/utils/llm-api-return";

type Payload = {
  selection: string;
  model: string;
  provider: string;
};

export async function POST(req: Request) {
  const startDate = new Date();
  try {
    const {selection, model, provider} = (await req.json()) as Payload;

    const client = new MistralClient(process.env.MISTRAL_API_KEY);
    const completion = await client.chat({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are a redaction assistant bot. You try to improve messages from a customer service to its customers.
          Given a text, you must improve and rephrase it in a more formal and welcoming. Give the text in french. 
          Don't add information or content, just stick with the original text
`,
        },
        {role: "user", content: selection},
      ],
    });
    return llmApiReturn(completion, model, startDate, provider);
  } catch (e) {
    console.log(e);
    return new Response((e as Error).message, {status: 500});
  }
}
