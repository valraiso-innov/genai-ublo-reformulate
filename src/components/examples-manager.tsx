import React, { useState, useEffect } from "react";
import Example from "./example";

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
    <div className="space-y-6 mx-6">
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
  );
};

export default ExamplesManager;