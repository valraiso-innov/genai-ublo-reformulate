import React from "react";
import {
  RiCloseLine,
  RiNumbersLine,
  RiMoneyEuroCircleLine,
  RiFlashlightLine,
  RiCloudLine,
  RiTimeLine,
} from "@remixicon/react";

interface FactorValueProps {
  metrics: Metrics;
  onClose: () => void;
}

export const MetricsVisualizer: React.FC<FactorValueProps> = ({
  metrics,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm ">
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 p-6 bg-white border rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <RiCloseLine size={24} />
        </button>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Résumé des Coûts</h1>
        </div>
        <div className="mb-6">
          <div className="text-base font-bold text-gray-600 flex justify-between mb-2">
            <span className="flex items-center">
              <RiNumbersLine className="mr-2 text-blue-600" /> Token en entrée:
            </span>
            <span className="text-xl font-semibold text-blue-600">
              {metrics.promptTokens} tokens
            </span>
          </div>
          <div className="text-base font-bold text-gray-600 flex justify-between mb-2">
            <span className="flex items-center">
              <RiNumbersLine className="mr-2 text-blue-600" /> Token en sortie:
            </span>
            <span className="text-xl font-semibold text-blue-600">
              {metrics.completionTokens} tokens
            </span>
          </div>
          <div className="text-base font-bold text-gray-600 flex justify-between mb-2">
            <span className="flex items-center">
              <RiMoneyEuroCircleLine className="mr-2 text-green-600" /> Prix en
              euros:
            </span>
            <span className="text-xl font-semibold text-green-600">
              {(metrics.cost_euro * 0.92).toFixed(5)} €
            </span>
          </div>
          <div className="text-base font-bold text-gray-600 flex justify-between mb-2">
            <span className="flex items-center">
              <RiFlashlightLine className="mr-2 text-yellow-600" /> Énergie
              consommée:
            </span>
            <span className="font-semibold text-yellow-600">
              {metrics.energy_wh.toFixed(5)} Wh
            </span>
          </div>
          <div className="text-base font-bold text-gray-600 flex justify-between mb-2">
            <span className="flex items-center">
              <RiCloudLine className="mr-2 text-orange-600" /> Émission CO2:
            </span>
            <span className="font-semibold text-orange-600">
              {metrics.gwp_gco2eq.toFixed(5)} g CO2 eq
            </span>
          </div>
          <div className="text-base font-bold text-gray-600 flex justify-between">
            <span className="flex items-center">
              <RiTimeLine className="mr-2 text-gray-600" /> Temps:
            </span>
            <span>{metrics.executionTime_s.toFixed(2)} seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};
