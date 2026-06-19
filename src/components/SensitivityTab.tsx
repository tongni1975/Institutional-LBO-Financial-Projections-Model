import React, { useState } from 'react';
import { calculateSensitivity } from '../utils/finance';
import { WaterfallStructure, YearForecast, MacroAssumptions, IndicativeValuation } from '../types';
import { LayoutGrid, HelpCircle, Eye, Sliders } from 'lucide-react';

interface SensitivityTabProps {
  forecast: YearForecast[];
  macro: MacroAssumptions;
  valuation: IndicativeValuation;
  waterfallConfig: WaterfallStructure;
}

export const SensitivityTab: React.FC<SensitivityTabProps> = ({
  forecast,
  macro,
  valuation,
  waterfallConfig,
}) => {
  const [metric, setMetric] = useState<'irr' | 'moic' | 'payoff'>('irr');

  // Multiples inputs with defaults
  const [entryMults, setEntryMults] = useState<number[]>([20.0, 21.0, 22.0, 23.0, 24.0]);
  const [exitMults, setExitMults] = useState<number[]>([16.5, 17.5, 18.5, 19.5, 20.5]);

  const [activeCell, setActiveCell] = useState<{ r: number; c: number; val: number } | null>(null);

  // Re-run sensitivity calculation on changing parameters
  const sensitivity = calculateSensitivity(metric, forecast, waterfallConfig, valuation, macro, entryMults, exitMults);

  // Helper inside loop to update specific axis coordinate
  const handleEntryMultChange = (idx: number, valStr: string) => {
    const val = parseFloat(valStr) || 0;
    setEntryMults(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleExitMultChange = (idx: number, valStr: string) => {
    const val = parseFloat(valStr) || 0;
    setExitMults(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  // Helper to draw background shade depending on return performance
  const getCellBgClass = (val: number) => {
    if (metric === 'irr') {
      const hurdle = waterfallConfig.hurdleRate;
      if (val >= hurdle + 5) return 'bg-emerald-600 text-white font-semibold';
      if (val >= hurdle) return 'bg-emerald-500 text-white font-medium';
      if (val >= hurdle - 5) return 'bg-amber-100 text-amber-800';
      if (val >= hurdle - 10) return 'bg-amber-50 text-amber-700';
      return 'bg-red-50 text-red-700 border-red-50';
    } else if (metric === 'moic') {
      if (val >= 2.5) return 'bg-emerald-600 text-white font-semibold';
      if (val >= 2.0) return 'bg-emerald-500 text-white font-medium';
      if (val >= 1.5) return 'bg-emerald-100 text-emerald-950';
      if (val >= 1.0) return 'bg-amber-100 text-amber-800';
      return 'bg-red-50 text-red-700';
    } else {
      // Payoff values
      const check = waterfallConfig.apecsCheckSizeUsd;
      if (val >= check * 2) return 'bg-emerald-600 text-white font-semibold';
      if (val >= check * 1.5) return 'bg-emerald-500 text-white font-medium';
      if (val >= check) return 'bg-emerald-100 text-emerald-950';
      return 'bg-red-50 text-red-700';
    }
  };

  return (
    <div className="space-y-6" id="sensitivity_tab_root">
      
      {/* SECTION 1: Parameters Dashboard Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs" id="card_sensitivity_controls">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 mb-4 border-b border-neutral-100 gap-4" id="sens_top">
          <div>
            <h3 className="font-sans font-semibold text-neutral-900 text-base tracking-tight flex items-center gap-1.5">
              <LayoutGrid className="w-5 h-5 text-neutral-500" />
              Institutional Sensitivity Analysis Plate
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Evaluates investment returns across different combinations of entry enterprise multiples (vertical) vs. exit multiples (horizontal).
            </p>
          </div>

          {/* Metric Selector Selector */}
          <div className="flex bg-neutral-100 rounded-lg p-1 self-start" id="sens_metric_toggle">
            <button
              id="btn_sens_irr"
              onClick={() => { setMetric('irr'); setActiveCell(null); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${metric === 'irr' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              Project IRR (%)
            </button>
            <button
              id="btn_sens_moic"
              onClick={() => { setMetric('moic'); setActiveCell(null); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${metric === 'moic' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              MoIC Multiple
            </button>
            <button
              id="btn_sens_payoff"
              onClick={() => { setMetric('payoff'); setActiveCell(null); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${metric === 'payoff' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              Payoff Amount
            </button>
          </div>
        </div>

        {/* Axis Tweak Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-xs" id="sens_axis_tweakers">
          <div className="space-y-2">
            <span className="font-semibold text-neutral-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Configure Row Axis: Implied Entry multiples
            </span>
            <div className="grid grid-cols-5 gap-2" id="row_inputs_grid">
              {entryMults.map((v, i) => (
                <div key={`entry-mult-in-${i}`} className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 mb-0.5">Scale {i+1}</span>
                  <input
                    id={`input_entry_mult_${i}`}
                    type="number"
                    step="0.5"
                    value={v}
                    onChange={e => handleEntryMultChange(i, e.target.value)}
                    className="w-full px-2 py-1 font-mono text-center rounded bg-neutral-50 border border-neutral-200 focus:outline-hidden focus:border-neutral-800"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-neutral-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Configure Column Axis: Exit Enterprise Multiple
            </span>
            <div className="grid grid-cols-5 gap-2" id="col_inputs_grid">
              {exitMults.map((v, i) => (
                <div key={`exit-mult-in-${i}`} className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 mb-0.5">Scale {i+1}</span>
                  <input
                    id={`input_exit_mult_${i}`}
                    type="number"
                    step="0.5"
                    value={v}
                    onChange={e => handleExitMultChange(i, e.target.value)}
                    className="w-full px-2 py-1 font-mono text-center rounded bg-neutral-50 border border-neutral-200 focus:outline-hidden focus:border-neutral-800"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Interactive 5x5 Heatmap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sensitivity_matrix_wrapper">
        
        {/* Heat Map grid */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs" id="card_heatmap_matrix">
          <div className="flex justify-between items-center pb-3 mb-5 border-b border-neutral-100">
            <h4 className="font-sans font-semibold text-neutral-900 text-sm">Return Heatmap: APECS Alternative</h4>
            <span className="text-[10px] text-neutral-400 font-medium font-mono uppercase tracking-widest">
              Active Mode: {waterfallConfig.payoffMode === 'calibrated' ? 'Calibrated APECS' : waterfallConfig.payoffMode}
            </span>
          </div>

          <div className="overflow-x-auto" id="heatmap_grid_wrapper">
            <div className="min-w-[400px]">
              {/* Header coordinate row containing exit multiples */}
              <div className="grid grid-cols-6 gap-2 mb-2 text-center" id="exit_mult_header_row">
                <div className="text-left text-[10px] font-bold text-neutral-400 self-end px-2 font-mono uppercase tracking-wider">
                  ENTRY \ EXIT
                </div>
                {sensitivity.exitLabels.map((lbl, idx) => (
                  <div key={`exit-lbl-${idx}`} className="py-2.5 bg-neutral-50 rounded-lg border border-neutral-100 text-xs font-mono font-bold text-neutral-800 flex flex-col justify-center">
                    <span>{lbl}</span>
                    <span className="text-[9px] text-neutral-400 font-normal">Exit Mult</span>
                  </div>
                ))}
              </div>

              {/* Rows of entry valuation metrics */}
              <div className="space-y-2" id="entry_mult_rows">
                {sensitivity.grid.map((rowArr, rIdx) => (
                  <div key={`row-${rIdx}`} className="grid grid-cols-6 gap-2 text-center items-center">
                    {/* Implied Multiple coordinate block */}
                    <div className="py-3 bg-neutral-50 rounded-lg border border-neutral-100 text-left px-3 text-xs font-mono font-bold text-neutral-800">
                      <span>{sensitivity.entryLabels[rIdx]}</span>
                      <span className="block text-[9px] text-neutral-400 font-normal">Entry Multiple</span>
                    </div>

                    {/* Active Heat cells */}
                    {rowArr.map((val, cIdx) => (
                      <div
                        id={`sens_cell_${rIdx}_${cIdx}`}
                        key={`cell-${rIdx}-${cIdx}`}
                        onClick={() => setActiveCell({ r: rIdx, c: cIdx, val })}
                        className={`py-4 rounded-lg cursor-pointer hover:scale-[1.02] transform transition-all duration-100 border border-neutral-200/20 text-xs font-mono text-center flex items-center justify-center ${getCellBgClass(val)} ${activeCell?.r === rIdx && activeCell?.c === cIdx ? 'ring-2 ring-neutral-950 scale-102 font-extrabold' : ''}`}
                      >
                        {metric === 'irr' ? `${val.toFixed(2)}%` : metric === 'moic' ? `${val.toFixed(2)}x` : `$${val.toFixed(0)}m`}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center text-[10px] text-neutral-400 font-sans font-medium mt-6 pt-4 border-t border-neutral-100 gap-3" id="matrix_legend">
            <span>💡 Tooltip: Click any cell to inspect deal structure parameters at that coordinate boundary.</span>
            <div className="flex space-x-3 items-center">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-sm"></span>
                <span>Superb Performance</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
                <span>Cleared Hurdle ({waterfallConfig.hurdleRate}%)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-amber-100 rounded-sm"></span>
                <span>Boundary Warning</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-red-50 rounded-sm"></span>
                <span>Unviable Yield</span>
              </span>
            </div>
          </div>
        </div>

        {/* Detail Sidebar Panel */}
        <div className="lg:col-span-4" id="matrix_detail_sidebar">
          {activeCell ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs text-xs space-y-4 h-full" id="card_sens_cell_details">
              <div className="flex items-center space-x-1.5 pb-2 border-b border-neutral-100">
                <span className="p-1.5 bg-neutral-900 text-white rounded-lg">
                  <Eye className="w-4 h-4" />
                </span>
                <h4 className="font-semibold text-neutral-900 font-sans">Active Coordinate Specs</h4>
              </div>

              <div className="space-y-2 font-sans" id="cell_specs">
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-500">Entry Multiple Coordinate:</span>
                  <span className="font-mono font-bold text-neutral-800">{sensitivity.entryLabels[activeCell.r]}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-500">Exit Multiple Coordinate:</span>
                  <span className="font-mono font-bold text-neutral-800">{sensitivity.exitLabels[activeCell.c]}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-500">Estimated Year 5 EBITDA:</span>
                  <span className="font-mono font-medium text-neutral-800">${forecast[5].ebitda.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-500">Calculated Exit EV (USD):</span>
                  <span className="font-mono font-medium text-neutral-900">
                    ${(forecast[5].ebitda * exitMults[activeCell.c]).toFixed(1)} m
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-500">Exit Equity Available:</span>
                  <span className="font-mono font-medium text-neutral-900">
                    ${(forecast[5].ebitda * exitMults[activeCell.c] + waterfallConfig.remainingNetDebtUsd).toFixed(1)} m
                  </span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-lg text-center" id="cell_metrics_sum">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Estimated Coordinate Yield</p>
                <p className="text-3xl font-mono font-extrabold text-neutral-950 mt-1">
                  {metric === 'irr' ? `${activeCell.val.toFixed(2)}%` : metric === 'moic' ? `${activeCell.val.toFixed(2)}x` : `$${activeCell.val.toFixed(1)}m`}
                </p>
                <div className="mt-2 text-[10px]">
                  {metric === 'irr' && activeCell.val >= waterfallConfig.hurdleRate ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">PASSED TARGET HURDLE</span>
                  ) : metric === 'irr' ? (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-full">FAILED TARGET HURDLE</span>
                  ) : (
                    <span className="text-neutral-400 italic">Structural Yield Estimate</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 border border-neutral-200 border-dashed rounded-xl p-6 text-center text-xs text-neutral-400 flex flex-col items-center justify-center space-y-2 h-full min-h-[220px]" id="matrix_detail_empty">
              <HelpCircle className="w-8 h-8 text-neutral-300" />
              <p className="font-medium">No Coordinates Selected</p>
              <p className="max-w-[180px] text-neutral-400 mx-auto">Click any grid cell in the heatmap matrix table to inspect active deal statistics.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
