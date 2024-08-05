import React, { useState, useEffect } from "react";
import Example from "./example";
import ExamplesLoad from "@/components/examples-load";
import { RiImportLine } from "@remixicon/react";

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
    <div className="mx-6">
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className={`absolute top-1 right-1 group block gap-2 text-xs p-2 rounded-full transition-colors duration-200 select-none
    ${nExamples === 0 ? "text-gray-300 cursor-not-allowed" : " text-gray-600 hover:text-blue-600"}
  `}
        disabled={nExamples === 0}
      >
        <RiImportLine />
        <span
          className="z-50 pointer-events-none absolute right-full top-1/2 transform -translate-y-1/2 ml-2
            whitespace-nowrap bg-blue-900 text-white text-xs rounded py-1 px-2 opacity-0
            group-hover:opacity-100 transition-opacity duration-300"
        >
          Choisir les exemples préremplis
        </span>
      </button>
      {isPopupOpen && (
        <ExamplesLoad
          setExamples={setExamples}
          nExamples={nExamples}
          closePopup={() => setIsPopupOpen(false)}
        />
      )}
      <div className="space-y-6">
        {examples.map((example, i) => (
          <Example
            key={i}
            index={i}
            example={example}
            expanded={expandedExamples[i]}
            toggleExample={toggleExample}
            updateExample={updateExample}
          />
        ))}
      </div>
    </div>
  );
};

export default ExamplesManager;
