import React, { useState } from "react";
import Select from "react-select";
import { examplePresets } from "@/utils/examples-presets";
import { RiCloseLine, RiImportLine } from "@remixicon/react";

interface ExamplesLoadProps {
  setExamples: (examples: { user: string; assistant: string }[]) => void;
  nExamples: number;
  closePopup: () => void;
}

const ExamplesLoad: React.FC<ExamplesLoadProps> = ({
  setExamples,
  nExamples,
  closePopup,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetName | null>(null);
  const [tempExamples, setTempExamples] = useState<Example[]>([]);
  const [selectedExamples, setSelectedExamples] = useState<Example[]>([]);

  const presetOptions = (Object.keys(examplePresets) as PresetName[]).map(
    (preset) => ({
      value: preset,
      label: preset,
    }),
  );

  const handlePresetChange = (selectedOption: any) => {
    const preset = examplePresets[selectedOption.value as PresetName];
    setSelectedPreset(selectedOption.value);
    setTempExamples(preset);
  };

  const handleCheckboxChange = (
    example: Example,
    isChecked: boolean,
  ) => {
    if (isChecked) {
      if (selectedExamples.length < nExamples) {
        setSelectedExamples([...selectedExamples, example]);
      }
    } else {
      setSelectedExamples(selectedExamples.filter((e) => e !== example));
    }
  };

  const applySelection = () => {
    setExamples(selectedExamples);
    closePopup();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Sélectionner un préréglage
        </h2>
        <Select
          options={presetOptions}
          onChange={handlePresetChange}
          className="mb-4"
        />
        {selectedPreset && (
          <div className="space-y-4 max-h-96 overflow-auto">
            {tempExamples.map((example, index) => (
              <div
                key={index}
                className="flex items-start p-4 border rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={selectedExamples.includes(example)}
                  onChange={(e) =>
                    handleCheckboxChange(example, e.target.checked)
                  }
                  disabled={
                    selectedExamples.length >= nExamples &&
                    !selectedExamples.includes(example)
                  }
                  className="mr-3 mt-1"
                  id={`example-${index}`}
                />
                <label
                  htmlFor={`example-${index}`}
                  className={`flex flex-col space-y-2 
                  ${selectedExamples.length >= nExamples && !selectedExamples.includes(example) ? "text-gray-300 cursor-not-allowed" : "text-black"}`}
                >
                  <div className="whitespace-pre-line">
                    <strong>User:</strong> {example.user}
                  </div>
                  <hr />
                  <div className="whitespace-pre-line">
                    <strong>Assistant:</strong> {example.assistant}
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <button
            onClick={closePopup}
            className="bg-red-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-red-700 transition-colors duration-200"
          >
            <RiCloseLine className="mr-2" />
            Fermer
          </button>
          <button
            onClick={applySelection}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-colors duration-200"
          >
            <RiImportLine className="mr-2" />
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamplesLoad;
