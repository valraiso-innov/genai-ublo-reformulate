import { NextResponse } from "next/server";
import { ChatCompletionResponse } from "@mistralai/mistralai";
import OpenAI from "openai";

const MODEL_COSTS: { [key: string]: number[] } = {
  "open-mistral-nemo": [0.3, 0.3],
  "mistral-large-latest": [4, 12],
  "mistral-medium-latest": [2.7, 8.1],
  "mistral-small-latest": [1, 3],
  "open-mixtral-8x22b": [2, 6],
  "open-mixtral-8x7b": [0.7, 0.7],
  "open-mistral-7b": [0.25, 0.25],
  "gpt-4o-mini": [0.15, 0.6],
  "gpt-4o": [5, 15],
  "gpt-4-turbo": [10, 30],
  "gpt-3.5-turbo": [0.5, 1.5],
};

const gptAPIReturn = (
  completion: ChatCompletionResponse | OpenAI.Chat.Completions.ChatCompletion,
  model: string,
  startTime: number,
) => {
  if (
    completion.choices[0].message.content === null ||
    completion.usage === undefined
  ) {
    return NextResponse.json(
      { error: "Failed to generate chat completion" },
      { status: 500 },
    );
  } else {
    const costPerToken = MODEL_COSTS[model];
    const cost_euro =
      (costPerToken[0] * completion.usage.prompt_tokens +
        costPerToken[1] * completion.usage.completion_tokens) /
      1000000;
    const executionTime_s = (Date.now() - startTime) / 1000;
    // const energy_wh = completion.impacts.energy_wh.value * 1000;
    // const gwp_gco2eq = completion.impacts.gwp_gco2eq.value * 1000;
    const energy_wh = 0;
    const gwp_gco2eq = 0;
    const adpe_kgsbeq = 0;
    const pe_mj = 0;

    return NextResponse.json({
      message: completion.choices[0].message.content,
      metrics: {
        cost_euro,
        executionTime_s,
        energy_wh,
        gwp_gco2eq,
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        adpe_kgsbeq,
        pe_mj,
      },
    });
  }
};

export default gptAPIReturn;
