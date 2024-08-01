import React, { useRef } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "@remixicon/react";
import useAutosize from "@/hooks/use-autosize";

interface ExampleProps {
  index: number;
  example: { user: string; assistant: string };
  expanded: boolean;
  toggleExample: (index: number) => void;
  updateExample: (index: number, field: "user" | "assistant", value: string) => void;
}

const Example: React.FC<ExampleProps> = ({
                                           index,
                                           example,
                                           expanded,
                                           toggleExample,
                                           updateExample,
                                         }) => {
  const userRef = useRef<HTMLTextAreaElement | null>(null);
  const assistantRef = useRef<HTMLTextAreaElement | null>(null);

  useAutosize(example.user, userRef);
  useAutosize(example.assistant, assistantRef);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div
        className="flex justify-between items-center cursor-pointer mb-2"
        onClick={() => toggleExample(index)}
      >
        <label className="text-xl font-semibold text-gray-800">
          Exemple {index + 1}
        </label>
        <button className="focus:outline-none">
          {expanded ? (
            <RiArrowDownSLine className="text-gray-600" />
          ) : (
            <RiArrowRightSLine className="text-gray-600" />
          )}
        </button>
      </div>
      {expanded && (
        <div className="pl-4 border-l-4 border-blue-500">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Exemple entrée {index + 1}
          </label>
          <textarea
            ref={userRef}
            value={example?.user || ""}
            onChange={(e) => updateExample(index, "user", e.target.value)}
            className="h-auto border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder-gray-500 resize-none overflow-hidden"
          />
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Exemple sortie  {index + 1}
          </label>
          <textarea
            ref={assistantRef}
            value={example?.assistant || ""}
            onChange={(e) => updateExample(index, "assistant", e.target.value)}
            className="h-auto border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder-gray-500 resize-none overflow-hidden"
          />
        </div>
      )}
    </div>
  );
};

export default Example;