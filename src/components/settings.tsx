import React from "react";
import ExamplesManager from "./examples-manager";

interface SettingsProps {
  reformulationWithHistory: ReformulationWithHistory;
  dispatch: React.Dispatch<Action>;
}

const SettingsPage: React.FC<SettingsProps> = ({
  reformulationWithHistory,
  dispatch,
}) => {
  const parameters = reformulationWithHistory.current.parameters;
  const isAdditionalSettings =
    reformulationWithHistory.current.isAdditionalSettings;

  const updateExamples = (examples: { user: string; assistant: string }[]) => {
    dispatch({
      type: reformulationWithHistory.current.action === "" ? "crush" : "init",
      payload: {
        ...reformulationWithHistory.current,
        action:"",
        parameters: { ...parameters, examples },
      },
    });
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value;
    let model = parameters.model;

    if (provider === "openai") {
      model = "gpt-4o-mini";
    } else if (provider === "mistral") {
      model = "open-mistral-nemo";
    }

    dispatch({
      type: reformulationWithHistory.current.action === "" ? "crush" : "init",
      payload: {
        ...reformulationWithHistory.current,
        action:"",
        parameters: {
          ...parameters,
          provider,
          model,
        },
      },
    });
  };

  const handleCheckboxChange = (field: keyof typeof isAdditionalSettings) => {
    dispatch({
      type: reformulationWithHistory.current.action === "" ? "crush" : "init",
      payload: {
        ...reformulationWithHistory.current,
        action:"",
        isAdditionalSettings: {
          ...isAdditionalSettings,
          [field]: !isAdditionalSettings[field],
        },
      },
    });
  };

  const handleInputChange = (field: keyof ParametersLLM, value: any) => {
    dispatch({
      type: reformulationWithHistory.current.action === "" ? "crush" : "init",
      payload: {
        ...reformulationWithHistory.current,
        action:"",
        parameters: { ...parameters, [field]: value },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <label className="block text-lg font-medium text-gray-700 mr-2">
              Longueur du texte en mots
            </label>
            <input
              type="checkbox"
              checked={isAdditionalSettings.isLengthEnabled}
              onChange={() => handleCheckboxChange("isLengthEnabled")}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          {isAdditionalSettings.isLengthEnabled && (
            <input
              type="number"
              value={parameters.length || 0}
              onChange={(e) =>
                handleInputChange("length", Number(e.target.value))
              }
              min={0}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrer la longueur en mots"
            />
          )}
        </div>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <label className="block text-lg font-medium text-gray-700 mr-2">
              Mots-clés à utiliser dans le texte
            </label>
            <input
              type="checkbox"
              checked={isAdditionalSettings.isKeywordsEnabled}
              onChange={() => {
                handleCheckboxChange("isKeywordsEnabled");
              }}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          {isAdditionalSettings.isKeywordsEnabled && parameters.keywords && (
            <input
              type="text"
              value={parameters.keywords.join(", ")}
              onChange={(e) =>
                handleInputChange(
                  "keywords",
                  e.target.value.split(",").map((keyword) => keyword.trim()),
                )
              }
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez les mots-clés séparés par des virgules, utilisez des guillemets pour mettre des espaces, exemple : ‘descente aux flambeaux’"
            />
          )}
        </div>
        <div>
          <div className="flex items-center mb-2">
            <label className="block text-lg font-medium text-gray-700 mr-2">
              Mots interdits dans le texte
            </label>
            <input
              type="checkbox"
              checked={isAdditionalSettings.isForbiddenEnabled}
              onChange={() => {
                handleCheckboxChange("isForbiddenEnabled");
              }}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          {isAdditionalSettings.isForbiddenEnabled &&
            parameters.forbiddenWords && (
              <input
                type="text"
                value={parameters.forbiddenWords.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "forbiddenWords",
                    e.target.value.split(",").map((word) => word.trim()),
                  )
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez les mots interdits séparés par des virgules, utilisez des guillemets pour mettre des espaces, exemple : ‘descente aux flambeaux’"
              />
            )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Nombre d&apos;exemples (0-3)
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">0</span>
          <input
            type="range"
            value={parameters.nExamples}
            onChange={(e) =>
              handleInputChange("nExamples", Number(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="3"
          />
          <span className="text-gray-700">3</span>
        </div>
        <div className="text-center text-lg font-medium text-gray-700 mt-2">
          {parameters.nExamples}
        </div>
        <ExamplesManager
          examples={parameters.examples}
          setExamples={updateExamples}
          nExamples={parameters.nExamples}
        />
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Choisir le fournisseur
          </label>
          <select
            value={parameters.provider}
            onChange={handleProviderChange}
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI</option>
            <option value="mistral">Mistral</option>
          </select>
        </div>
        <div className="mt-2">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Choisir le modèle
          </label>
          <select
            value={parameters.model}
            onChange={(e) => handleInputChange("model", e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {parameters.provider === "openai" ? (
              <>
                <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
                <option value="gpt-4o">GPT 4o</option>
                <option value="gpt-4o-mini">GPT 4o mini</option>
              </>
            ) : (
              <>
                <option value="open-mixtral-8x7b">Mixtral 8x7B</option>
                <option value="open-mixtral-8x22b">Mixtral 8x22B</option>
                <option value="open-mistral-nemo">Mistral Nemo</option>
              </>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
