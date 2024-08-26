"use client";

import React, {useRef, useState} from "react";
import {generateText, callReformulateApi} from "@/utils/generate-text";
import {
  RiLeafLine,
  RiMagicFill,
  RiMagicLine,
  RiSparklingFill,
  RiSparklingLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "@remixicon/react";
import HistoricButton from "@/components/historic-button";
import useSelection from "@/hooks/use-selection";
import {impacts, userAction, userFeedback} from "@/services/analytics-api";
import useAutosize from "@/hooks/use-autosize";
import {MetricsVisualizer} from "@/components/metrics-visualizer";

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
  const [metrics, setMetrics] = useState<Metrics>();
  const [showMetrics, setShowMetrics] = useState(false);
  const [loadingSpark, setLoadingSpark] = useState<boolean>(false);
  const [loadingMagic, setLoadingMagic] = useState<boolean>(false);

  const {isSelected, selection} = useSelection(textOutRef);

  const disabled = !isSelected || !selection;
  const parameters = reformulationWithHistory.current.parameters;
  const active = reformulationWithHistory.current.isAdditionalSettings;

  const generate = async () => {
    setLoadingSpark(true);
    if (!reformulationWithHistory.current.textIn) {
      alert("Veuillez entrer le texte à reformuler.");
      return;
    } else {
      const data = await generateText(
        reformulationWithHistory.current.textIn,
        parameters.examples,
        parameters.provider,
        parameters.model,
        active.isLengthEnabled ? parameters.length : undefined,
        active.isKeywordsEnabled ? parameters.keywords : undefined,
        active.isForbiddenEnabled ? parameters.forbiddenWords : undefined,
      );
      setMetrics(data.metrics);
      await impacts({model: parameters.model, ...data.metrics});
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
            rating: undefined,
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
            rating: undefined,
          },
        });
      }
    }
    setLoadingSpark(false);
  };

  const reformulate = async () => {
    if (disabled) return;
    setLoadingMagic(true);
    const data = await callReformulateApi(
      selection,
      parameters.provider,
      parameters.model,
    );
    setMetrics(data.metrics);
    await impacts({model: parameters.model, ...data.metrics});
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
        rating: undefined,
      },
    });
    setLoadingMagic(false);
  };

  useAutosize(reformulationWithHistory.current.textIn, textInRef);
  useAutosize(reformulationWithHistory.current.textOut, textOutRef);

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
    if (reformulationWithHistory.current.rating === undefined) {
      dispatch({
        type: "crush",
        payload: {
          ...reformulationWithHistory.current,
          rating: type,
        },
      });
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
            ${loadingSpark ? "text-msem-button" : "bg-white"} 
            ${!reformulationWithHistory.current.textIn ? "text-gray-200 cursor-not-allowed" : "hover:text-msem-button"}`}
          disabled={!reformulationWithHistory.current.textIn}
        >
          {loadingSpark ? (
            <RiSparklingFill size={18} className="animate-spin"/>
          ) : (
            <RiSparklingLine size={18}/>
          )}
          <span
            className="z-50 pointer-events-none absolute left-full top-1/2 transform -translate-y-1/2 ml-2
            whitespace-nowrap bg-blue-900 text-white text-xs rounded py-1 px-2 opacity-0
            group-hover:opacity-100 transition-opacity duration-300"
          >
            Reformuler le texte complet
          </span>
        </button>
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className={`relative group block gap-2 text-xs p-2 rounded-full transition-colors duration-200 select-none 
           ${!metrics ? "text-gray-200 cursor-not-allowed" : "hover:text-msem-button"}`}
          disabled={!metrics}
        >
          <RiLeafLine/>
          <span
            className="z-50 pointer-events-none absolute left-full top-1/2 transform -translate-y-1/2 ml-2
            whitespace-nowrap bg-blue-900 text-white text-xs rounded py-1 px-2 opacity-0
            group-hover:opacity-100 transition-opacity duration-300"
          >
            Voir l&apos;impact de la génération
          </span>
        </button>
      </div>
      {showMetrics && metrics ? (
        <MetricsVisualizer metrics={metrics} onClose={() => setShowMetrics(!showMetrics)}/>) : ""}
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
                loadingMagic ? "text-msem-button" : "bg-white"
              } ${!disabled ? "hover:text-msem-button" : "text-slate-300 cursor-not-allowed"}`}
            >
              {loadingMagic ? (
                <RiMagicFill size={18} className="animate-pulse"/>
              ) : (
                <RiMagicLine size={18}/>
              )}
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
              ${reformulationWithHistory.current.rating !== undefined ? "text-gray-300 cursor-not-allowed" : "hover:text-msem-button"}`}
              disabled={reformulationWithHistory.current.rating !== undefined}
            >
              {reformulationWithHistory.current.rating === "like" ? (
                <RiThumbUpFill size={18}/>
              ) : (
                <RiThumbUpLine size={18}/>
              )}
            </button>
            <button
              onClick={() => handleFeedback("dislike")}
              className={`relative group block gap-2 text-xs p-2 rounded-full transition-colors duration-200 select-none 
              ${reformulationWithHistory.current.rating !== undefined ? "text-gray-300 cursor-not-allowed" : "hover:text-msem-button"}`}
              disabled={reformulationWithHistory.current.rating !== undefined}
            >
              {reformulationWithHistory.current.rating === "dislike" ? (
                <RiThumbDownFill size={18}/>
              ) : (
                <RiThumbDownLine size={18}/>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default GeneratePage;
