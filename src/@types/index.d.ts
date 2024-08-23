type ParametersLLM = {
  provider: string;
  model: string;
  nExamples: number;
  examples: Example[];
  length?: number;
  keywords?: string[];
  forbiddenWords?: string[];
};

type ReformulationWithHistory = {
  past: Reformulation[];
  future: Reformulation[];
  current: Reformulation;
};

type Action =
  | { type: "undo" }
  | { type: "redo" }
  | { type: "crush"; payload: Reformulation }
  | { type: "set_message"; payload: Reformulation }
  | { type: "init"; payload: Reformulation };

type Reformulation = {
  textIn: string;
  textOut: string;
  action: string;
  parameters: ParametersLLM;
  isAdditionalSettings: AdditionalSettingsEnabled;
  rating?: "like" | "dislike";
};

interface Example {
  user: string;
  assistant: string;
}

interface ExamplePresets {
  "Description Reformulation": Example[];
  "Ublo Reformulation": Example[];
}

type PresetName = keyof ExamplePresets;

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type AdditionalSettingsEnabled = {
  isLengthEnabled: boolean;
  isKeywordsEnabled: boolean;
  isForbiddenEnabled: boolean;
};

interface Metrics {
  cost_euro: number;
  executionTime_s: number;
  energy_wh: number;
  gwp_gco2eq: number;
  promptTokens: number;
  completionTokens: number;
  adpe_kgsbeq: number;
  pe_mj: number;
}
