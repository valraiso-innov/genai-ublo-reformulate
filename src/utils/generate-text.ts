const PROMPT_MAIN = (length?: number, keywords?: string[], forbiddenWords?: string[]) => `
  You are a creative and resourceful assistant with a talent for rephrasing descriptions. 
  Your task is to transform the given text into a more engaging and appealing version while preserving its core meaning. 
  By rearranging words and sentences, you will create a fresh and unique presentation that effectively sells a service. 
  Embrace creativity and think outside the box to enhance the overall appeal and originality of the text.
  ${keywords && keywords.length > 0 ? `You MUST use the following keywords: ${keywords.join(", ")}` : ""}
  ${forbiddenWords && forbiddenWords.length > 0 ? `The following words are prohibited, you MUST NOT use them: ${forbiddenWords.join(", ")}` : ""}
  Do not include markdown specifically NO bold "**". 

  Instructions:

  1. You will receive a text in French.
  2. Produce a new, original, and creative version of the text in French.
  3. Incorporate specific keywords for SEO purposes.
  4. Change the order of sentences; maintaining the original structure is not necessary.
  5. Present the revised text with line breaks and list if necessary.
  ${length && length !== 0 ? `6. The text needs to be ${length} words` : ""}
`;

async function callGenerateApi(messages: Message[], provider: string, model: string) {
  console.log(messages);
  const authToken = sessionStorage.getItem("token") || "";
  const endpoint = provider === "mistral" ? "/api/mistral" : "/api/openai";
  const completion = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: authToken,
    },
    body: JSON.stringify({
      messages,
      model,
    }),
  });
  return await completion.json();
}

function createPromptMessages(
  inputText: string,
  examples: Example[],
  length?: number,
  keywords?: string[],
  forbiddenWords?: string[]
) {
  const messages: Message[] = [
    { role: "system", content: PROMPT_MAIN(length, keywords, forbiddenWords) },
    ...(examples.flatMap((example) => [
      { role: "user", content: example.user },
      { role: "assistant", content: example.assistant },
    ]) as Message[]),
    { role: "user", content: inputText },
  ];
  return messages;
}

export async function generateText(
  inputText: string,
  examples: Example[],
  provider: string,
  model: string,
  length?: number,
  keywords?: string[],
  forbiddenWords?: string[]
) {
  const messages = createPromptMessages(inputText, examples, length, keywords, forbiddenWords);
  return await callGenerateApi(messages, provider, model);
}

export async function callReformulateApi(selection: string, provider: string, model: string) {
  console.log(selection);
  const authToken = sessionStorage.getItem("token") || "";
  const endpoint = provider === "mistral" ? "/api/mistral/selection" : "/api/openai/selection";
  const completion = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: authToken,
    },
    body: JSON.stringify({
      selection,
      model,
    }),
  });
  return await completion.json();
}