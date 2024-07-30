"use client";

import React, { useReducer, useState } from "react";
import SettingsPage from "@/components/settings";
import GeneratePage from "@/components/generate";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiSettings3Line,
  RiText,
} from "@remixicon/react";

const computeNewState = (state: Reformulation, action: Action) => {
  switch (action.type) {
    case "init":
      return action.payload;
    default:
      return state;
  }
};

const initialState = {
  textIn: "",
  textOut: "",
  action: "",
  parameters: {
    provider: "openai",
    model: "gpt-4o-mini",
    nExamples: 0,
    examples: [],
    keywords: [],
    forbiddenWords: [],
  },
  isAdditionalSettings: {
    isLengthEnabled: false,
    isKeywordsEnabled: false,
    isForbiddenEnabled: false,
  },
};

const reducer = (
  state: ReformulationWithHistory,
  action: Action,
): ReformulationWithHistory => {
  switch (action.type) {
    case "undo":
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, state.past.length - 1),
        future: [state.current, ...state.future],
        current: state.past[state.past.length - 1],
      };
    case "redo":
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.current],
        future: state.future.slice(1),
        current: state.future[0],
      };
    case "crush":
      return {
        past: state.past,
        future: state.future,
        current: action.payload,
      };
    default:
      return {
        past: [...state.past, state.current],
        future: [],
        current: computeNewState(state.current, action),
      };
  }
};

const Playground = () => {
  const [reformulationWithHistory, dispatch] = useReducer(reducer, {
    past: [],
    future: [],
    current: initialState,
  });

  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);

  const toggleSettings = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-100">
      <div className="flex flex-col bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <RiText className="w-8 h-8 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Reformuler le texte
          </h1>
        </div>
        <GeneratePage
          reformulationWithHistory={reformulationWithHistory}
          dispatch={dispatch}
        />
      </div>

      <div className="flex flex-col bg-white shadow-md rounded-lg p-6 mt-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={toggleSettings}
        >
          <div className="flex items-center">
            <RiSettings3Line className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          </div>
          <button className="focus:outline-none">
            {isSettingsExpanded ? (
              <RiArrowDownSLine className="w-6 h-6 text-gray-600" />
            ) : (
              <RiArrowRightSLine className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
        {isSettingsExpanded && (
          <div className="mt-4">
            <SettingsPage
              reformulationWithHistory={reformulationWithHistory}
              dispatch={dispatch}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;
