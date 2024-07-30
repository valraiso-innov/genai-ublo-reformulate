import React from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

type TextFieldProps = {
  dispatch: React.Dispatch<Action>;
  reformulationWithHistory: ReformulationWithHistory;
};

const HistoricButton: React.FC<TextFieldProps> = ({
  dispatch,
  reformulationWithHistory,
}) => {
  const currentIndex = reformulationWithHistory.past.length + 1;
  const totalStates =
    reformulationWithHistory.past.length + reformulationWithHistory.future.length + 1;
  return (
    <div className="flex items-center space-x-1">
      <button
        className={`text-xs transition-colors duration-200 ${
          reformulationWithHistory.past.length === 0
            ? "text-slate-300 cursor-not-allowed"
            : "hover:text-msem-button"
        }`}
        onClick={() => dispatch({ type: "undo" })}
        disabled={reformulationWithHistory.past.length === 0}
      >
        <RiArrowLeftSLine size={18} />
      </button>
      <div className="p-2 text-xs">
        <span>
          {currentIndex} / {totalStates}
        </span>
      </div>
      <button
        className={`text-xs transition-colors duration-200 ${
          reformulationWithHistory.future.length === 0
            ? "text-slate-300 cursor-not-allowed"
            : "hover:text-msem-button"
        }`}
        onClick={() => dispatch({ type: "redo" })}
        disabled={reformulationWithHistory.future.length === 0}
      >
        <RiArrowRightSLine size={18} />
      </button>
    </div>
  );
};

export default HistoricButton;
