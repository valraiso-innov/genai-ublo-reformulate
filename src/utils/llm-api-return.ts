import {NextResponse} from "next/server";
import {ChatCompletionResponse} from "@mistralai/mistralai";
import {completeImpact as completeImpactOpenAI} from "@genai-impact/ecologits-openai" ;
import {completeImpact as completeImpactMistral} from "@genai-impact/ecologits-mistral";
import OpenAI from "openai";

const MODEL_COSTS: { [key: string]: number[] } = {
  "open-mistral-nemo": [0.3, 0.3],
  "mistral-large-latest": [4, 12],
  "open-mixtral-8x22b": [2, 6],
  "open-mixtral-8x7b": [0.7, 0.7],
  "gpt-4o-mini": [0.15, 0.6],
  "gpt-4o": [5, 15],
  "gpt-3.5-turbo": [0.5, 1.5],
};

const llmApiReturn = (
  completion: ChatCompletionResponse | OpenAI.Chat.Completions.ChatCompletion,
  model: string,
  statDate: Date,
  provider: string,
) => {
  if (
    completion.choices[0].message.content === null ||
    completion.usage === undefined
  ) {
    return NextResponse.json(
      {error: "Failed to generate chat completion"},
      {status: 500},
    );
  } else {
    let impacts
    if (provider === "mistral") {
      impacts = completeImpactMistral(completion, model, statDate);
    } else {
      impacts = completeImpactOpenAI(completion as OpenAI.Chat.Completions.ChatCompletion, model, statDate)
    }
    const costPerToken = MODEL_COSTS[model];
    const cost_euro =
      (costPerToken[0] * completion.usage.prompt_tokens +
        costPerToken[1] * completion.usage.completion_tokens) /
      1000000;
    const executionTime_s = (Date.now() - statDate.getTime()) / 1000;
    const energy_wh = impacts.energy.value * 1000;
    const gwp_gco2eq = impacts.gwp.value * 1000;
    const adpe_kgsbeq = impacts.adpe.value;
    const pe_mj = impacts.pe.value;

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

export default llmApiReturn;
