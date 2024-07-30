const { api, domain } = {
  api: "https://plausible.io/api/event",
  domain: "genai-ublo-reformulate.vercel.app",
};
type Props = ActionProps | FeedbackProps | Impacts;

export const sendEvent = async (name: string, url: string, props?: Props) => {
  const URL = `${api}`;
  const body = {
    name,
    url,
    domain,
    props,
  };

  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

type Feature =
  | "rephrase-generate"
  | "rephrase-selection";
type ActionProps = {
  textIn: string;
  textOut: string;
  selection?: string;
  source?: string;
  model: string;
  nExample: number;
};
export function userAction(featureName: Feature, props: ActionProps) {
  return sendEvent(
    `Génération : ${featureName}`,
    `/v0/${props.model}/${featureName}`,
    props
  );
}

type Feedback =
  | "like"
  | "dislike";
type FeedbackProps = {
  textIn: string;
  textOut: string;
  feature: Feature;
  model: string;
  nExample: number;
};
export function userFeedback(type: Feedback, props: FeedbackProps) {
  return sendEvent(
    `Feedback : ${type}`,
    `/v0/${props.model}/${props.feature}/${type}`,
    props
  );
}

type Impacts = {
  textIn: number;
  model: string;
  cost_euro: number;
  executionTime_s: number;
  energy_wh: number;
  gwp_gco2eq: number;
  promptTokens: number;
  completionTokens: number;
  adpe_kgsbeq: number;
  pe_mj: number;
};
export function impacts(props: Impacts) {
  return sendEvent(`Impacts`, `/v0/${props.model}/impacts`, props);
}
