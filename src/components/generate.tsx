"use client";

import React, { useEffect, useRef, useState } from "react";
import { generateText, callReformulateApi } from "@/utils/generate-text";
import {
  RiMagicLine,
  RiSparklingLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "@remixicon/react";
import HistoricButton from "@/components/historic-button";
import useSelection from "@/hooks/use-selection";
import autosizeTextArea from "@/utils/autosize-text-area";
import { userAction, userFeedback } from "@/services/analytics-api";

interface GeneratePromps {
  dispatch: React.Dispatch<Action>;
  reformulationWithHistory: ReformulationWithHistory;
}

const GeneratePage: React.FC<GeneratePromps> = ({
  dispatch,
  reformulationWithHistory,
}) => {
  const textOutRef = useRef<HTMLTextAreaElement | null>(null);
  const textInRef = useRef<HTMLTextAreaElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackGiven, setFeedbackGiven] = useState<
    "none" | "like" | "dislike"
  >("none");
  const { isSelected, selection } = useSelection(textOutRef);

  const disabled = !isSelected || !selection;
  const parameters = reformulationWithHistory.current.parameters;

  const generate = async () => {
    setLoading(true);
    if (!reformulationWithHistory.current.textIn) {
      alert("Veuillez entrer le texte à reformuler.");
      return;
    } else {
      const data = await generateText(
        reformulationWithHistory.current.textIn,
        parameters.examples,
        parameters.provider,
        parameters.model,
        parameters.length,
        parameters.keywords,
        parameters.forbiddenWords,
      );
      await userAction("rephrase-generate", {
        textIn: reformulationWithHistory.current.textIn,
        textOut: data.message,
        model: parameters.model,
        nExample: parameters.nExamples,
      });
      if (
        reformulationWithHistory.current.action === "user-modif" ||
        reformulationWithHistory.current.action === ""
      ) {
        dispatch({
          type: "crush",
          payload: {
            ...reformulationWithHistory.current,
            textIn: reformulationWithHistory.current.textIn,
            textOut: data ? data.message : "",
            action: "generate",
          },
        });
      } else {
        dispatch({
          type: "init",
          payload: {
            ...reformulationWithHistory.current,
            textIn: reformulationWithHistory.current.textIn,
            textOut: data ? data.message : "",
            action: "generate",
          },
        });
      }
    }
    setLoading(false);
  };

  const reformulate = async () => {
    if (disabled) return;
    setLoading(true);
    const data = await callReformulateApi(
      selection,
      parameters.provider,
      parameters.model,
    );
    await userAction("rephrase-generate", {
      textIn: reformulationWithHistory.current.textIn,
      textOut: data.message,
      selection: selection,
      source: reformulationWithHistory.current.textOut,
      model: parameters.model,
      nExample: parameters.nExamples,
    });
    dispatch({
      type: "init",
      payload: {
        ...reformulationWithHistory.current,
        textIn: reformulationWithHistory.current.textIn,
        textOut: data
          ? reformulationWithHistory.current.textOut.replace(
              selection,
              data.message,
            )
          : "",
        action: "selection",
      },
    });
    setLoading(false);
  };

  useEffect(() => {
    autosizeTextArea(textInRef);
    autosizeTextArea(textOutRef);
  }, [
    reformulationWithHistory.current.textIn,
    reformulationWithHistory.current.textOut,
  ]);

  useEffect(() => {
    const handleResize = () => {
      autosizeTextArea(textInRef);
      autosizeTextArea(textOutRef);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (reformulationWithHistory.current.action === "") {
      dispatch({
        type: "crush",
        payload: {
          ...reformulationWithHistory.current,
          textIn: e.target.value,
        },
      });
    } else {
      dispatch({
        type: "init",
        payload: {
          ...reformulationWithHistory.current,
          textIn: e.target.value,
          textOut: "",
          action: "",
        },
      });
    }
  };

  const handleOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (reformulationWithHistory.current.action === "user-modif") {
      dispatch({
        type: "crush",
        payload: {
          ...reformulationWithHistory.current,
          textOut: e.target.value,
        },
      });
    } else {
      dispatch({
        type: "init",
        payload: {
          ...reformulationWithHistory.current,
          textIn: reformulationWithHistory.current.textIn,
          textOut: e.target.value,
          action: "user-modif",
        },
      });
    }
  };

  const handleFeedback = (type: "like" | "dislike") => {
    if (feedbackGiven === "none") {
      setFeedbackGiven(type);
      return userFeedback(type, {
        textIn: reformulationWithHistory.current.textIn,
        textOut: reformulationWithHistory.current.textOut,
        feature:
          reformulationWithHistory.current.action === "generate"
            ? "rephrase-generate"
            : "rephrase-selection",
        model: parameters.model,
        nExample: parameters.nExamples,
      });
    }
  };

  return (
    <div>
      <textarea
        value={reformulationWithHistory.current.textIn}
        ref={textInRef}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-lg p-4 w-full h-64 focus:outline-none focus:ring-2 focus:ring-blue-500
        placeholder-gray-500 resize-none overflow-hidden"
        placeholder="Texte à reformuler"
      />
      <div className="flex flex-row">
        <HistoricButton
          dispatch={dispatch}
          reformulationWithHistory={reformulationWithHistory}
        />
        <button
          onClick={generate}
          className={`relative group block gap-2 text-xs p-2 rounded-full transition-colors duration-200 select-none 
          hover:text-msem-button  ${loading ? "text-msem-button" : "bg-white"}`}
        >
          <RiSparklingLine size={18} />
          <span
            className="z-50 pointer-events-none absolute left-full top-1/2 transform -translate-y-1/2 ml-2
            whitespace-nowrap bg-blue-900 text-white text-xs rounded py-1 px-2 opacity-0
            group-hover:opacity-100 transition-opacity duration-300"
          >
            Reformuler le texte complet
          </span>
        </button>
      </div>
      {reformulationWithHistory.current.textOut && (
        <div className="bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Texte Reformulé :
          </h2>
          <textarea
            className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder-gray-500 resize-none overflow-hidden"
            onChange={handleOutputChange}
            ref={textOutRef}
            value={reformulationWithHistory.current.textOut}
          />
          <div className="flex flex-row">
            <HistoricButton
              dispatch={dispatch}
              reformulationWithHistory={reformulationWithHistory}
            />
            <button
              onClick={reformulate}
              className={`relative group block gap-2 text-xs p-2 rounded-full transition-colors duration-200 select-none ${
                loading ? "text-msem-button" : "bg-white"
              } ${!disabled ? "hover:text-msem-button" : "text-slate-300 cursor-not-allowed"}`}
            >
              <RiMagicLine size={18} />
              <span
                className="z-50 pointer-events-none absolute left-full top-1/2 transform -translate-y-1/2 ml-2
                whitespace-nowrap bg-blue-900 text-white text-xs rounded py-1 px-2 opacity-0
                group-hover:opacity-100 transition-opacity duration-300"
              >
                Reformuler le texte sélectionné
              </span>
            </button>
            <button
              onClick={() => handleFeedback("like")}
              className={`relative group block gap-2 text-xs p-2 rounded-full transition-colors duration-200 select-none 
              ${feedbackGiven !== "none" ? "text-gray-300 cursor-not-allowed" : "hover:text-msem-button"}`}
              disabled={feedbackGiven !== "none"}
            >
              {feedbackGiven === "like" ? (
                <RiThumbUpFill size={18} />
              ) : (
                <RiThumbUpLine size={18} />
              )}
            </button>
            <button
              onClick={() => handleFeedback("dislike")}
              className={`relative group block gap-2 text-xs p-2 rounded-full transition-colors duration-200 select-none 
              ${feedbackGiven !== "none" ? "text-gray-300 cursor-not-allowed" : "hover:text-msem-button"}`}
              disabled={feedbackGiven !== "none"}
            >
              {feedbackGiven === "dislike" ? (
                <RiThumbDownFill size={18} />
              ) : (
                <RiThumbDownLine size={18} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default GeneratePage;
