import React, { useState, useEffect } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react";

interface ExamplesManagerProps {
  examples: { user: string; assistant: string }[];
  setExamples: (examples: { user: string; assistant: string }[]) => void;
  nExamples: number;
}

const ExamplesManager: React.FC<ExamplesManagerProps> = ({
  examples,
  setExamples,
  nExamples,
}) => {
  const [expandedExamples, setExpandedExamples] = useState<boolean[]>(
    Array(nExamples).fill(false),
  );

  useEffect(() => {
    if (examples.length === nExamples) return;
    const initializedExamples = Array.from({ length: nExamples }, (_, i) => ({
      user: examples[i]?.user || "",
      assistant: examples[i]?.assistant || "",
    }));

    setExamples(initializedExamples);
  }, [nExamples, examples, setExamples]);

  const updateExample = (
    index: number,
    field: "user" | "assistant",
    value: string,
  ) => {
    if (index >= 0 && index < examples.length) {
      const newExamples = [...examples];
      newExamples[index] = {
        ...newExamples[index],
        [field]: value,
      };
      setExamples(newExamples);
    }
  };

  const toggleExample = (index: number) => {
    const newExpandedExamples = [...expandedExamples];
    newExpandedExamples[index] = !newExpandedExamples[index];
    setExpandedExamples(newExpandedExamples);
  };

  return (
    <div className="space-y-6 mb-6 mx-6">
      {[...Array(nExamples)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow-lg">
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleExample(i)}
          >
            <label className="text-xl font-semibold text-gray-800">
              Exemple {i + 1}
            </label>
            <button className="focus:outline-none">
              {expandedExamples[i] ? (
                <RiArrowDownSLine className="w-6 h-6 text-gray-600" />
              ) : (
                <RiArrowRightSLine className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
          {expandedExamples[i] && (
            <div className="pl-4 border-l-4 border-blue-500">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Utilisateur Exemple {i + 1}
              </label>
              <textarea
                value={examples[i]?.user || ""}
                onChange={(e) => updateExample(i, "user", e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Assistant Exemple {i + 1}
              </label>
              <textarea
                value={examples[i]?.assistant || ""}
                onChange={(e) => updateExample(i, "assistant", e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExamplesManager;
