import React from 'react';
import { MacroAssumptions, IndicativeValuation, BaselineEarnings } from '../types';
import { calculateEntryBridge } from '../utils/finance';
import { TrendingUp, DollarSign, Eye, RefreshCw } from 'lucide-react';

interface AsmTabProps {
  macro: MacroAssumptions;
  setMacro: React.Dispatch<React.SetStateAction<MacroAssumptions>>;
  valuation: IndicativeValuation;
  setValuation: React.Dispatch<React.SetStateAction<IndicativeValuation>>;
  earnings: BaselineEarnings;
  setEarnings: React.Dispatch<React.SetStateAction<BaselineEarnings>>;
}

export const AsmTab: React.FC<AsmTabProps> = ({
  macro,
  setMacro,
  valuation,
  setValuation,
  earnings,
  setEarnings,
}) => {
  const bridge = calculateEntryBridge(macro, valuation, earnings);

  const handleMacroChange = (key: keyof MacroAssumptions, val: number) => {
    setMacro(prev => ({ ...prev, [key]: val }));
  };

  const handleValuationChange = (key: keyof IndicativeValuation, val: number) => {
    setValuation(prev => ({ ...prev, [key]: val }));
  };

  const handleEarningsChange = (key: keyof BaselineEarnings, val: number) => {
    setEarnings(prev => ({ ...prev, [key]: val }));
  };

  // Convert number to currency string JPY
  const formatJPY = (num: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(num) + ' m';
  };

  // Convert number to currency string USD
  const formatUSD = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 1 }).format(num) + ' m';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="asm_tab_root">
      {/* LEFT PANEL: Inputs & Variables */}
      <div className="lg:col-span-4 space-y-6" id="asm_inputs_panel">
        {/* Card 1: Macro & FX Assumptions */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs" id="card_macro_fx">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-neutral-100">
            <span className="p-1.5 bg-neutral-100 text-neutral-700 rounded-lg">
              <RefreshCw className="w-4 h-4" />
            </span>
            <h3 className="font-sans font-semibold text-neutral-900 text-sm tracking-tight">Macro & FX Assumptions</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-neutral-500">Transaction Spot Rate (JPY/USD)</label>
                <span className="text-xs font-mono font-bold text-neutral-800">{macro.spotRate.toFixed(1)}</span>
              </div>
              <input
                id="input_spot_rate"
                type="range"
                min="100.0"
                max="200.0"
                step="0.5"
                value={macro.spotRate}
                onChange={e => handleMacroChange('spotRate', parseFloat(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-100 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-neutral-400 mt-1">Converts target deal JPY layers & waterfall flows.</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-neutral-500">Period Average Rate (JPY/USD)</label>
                <span className="text-xs font-mono font-bold text-neutral-800">{macro.avgRate.toFixed(1)}</span>
              </div>
              <input
                id="input_avg_rate"
                type="range"
                min="100.0"
                max="200.0"
                step="0.5"
                value={macro.avgRate}
                onChange={e => handleMacroChange('avgRate', parseFloat(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-100 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-neutral-400 mt-1">Translates operating incomes & historical elements.</p>
            </div>
          </div>
        </div>

        {/* Card 2: Transaction Valuation Parameters */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs" id="card_transaction_valuation">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-neutral-100">
            <span className="p-1.5 bg-neutral-100 text-neutral-700 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
            <h3 className="font-sans font-semibold text-neutral-900 text-sm tracking-tight">Enterprise Valuation Layers</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Indicative Ask Price EV (USD m)</label>
              <div className="relative">
                <input
                  id="input_ask_ev"
                  type="number"
                  value={valuation.askPriceEvUsd}
                  onChange={e => handleValuationChange('askPriceEvUsd', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">Current management ask valuation (Base Case).</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Proposed Entry EV (USD m)</label>
              <div className="relative">
                <input
                  id="input_proposed_ev"
                  type="number"
                  value={valuation.proposedEvUsd}
                  onChange={e => handleValuationChange('proposedEvUsd', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 focus:bg-white border-emerald-500 text-emerald-900"
                />
              </div>
              <p className="text-[10px] text-emerald-600 font-medium mt-1">APECS Partners' structured entry proposal target.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Gross Debt (JPY m)</label>
                <input
                  id="input_gross_debt"
                  type="number"
                  value={valuation.grossDebtJpy}
                  onChange={e => handleValuationChange('grossDebtJpy', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Target Cash (JPY m)</label>
                <input
                  id="input_target_cash"
                  type="number"
                  value={valuation.cashJpy}
                  onChange={e => handleValuationChange('cashJpy', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>
            <p className="text-[10px] text-neutral-400">Net Debt is computed automatically as the sum of Cash and Gross Debt.</p>
          </div>
        </div>

        {/* Card 3: Baseline Target Earnings */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs" id="card_baseline_earnings">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-neutral-100">
            <span className="p-1.5 bg-neutral-100 text-neutral-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-sans font-semibold text-neutral-900 text-sm tracking-tight">Baseline Target Earnings (FY25)</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Planned Operating Income (JPY m)</label>
              <input
                id="input_operating_income"
                type="number"
                value={earnings.operatingIncomeJpy}
                onChange={e => handleEarningsChange('operatingIncomeJpy', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Depreciation & Amortization (JPY m)</label>
              <input
                id="input_da"
                type="number"
                value={earnings.daJpy}
                onChange={e => handleEarningsChange('daJpy', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Bridge Output Table & Chart */}
      <div className="lg:col-span-8 space-y-6" id="asm_outputs_panel">
        {/* Entry Valuation Bridge Comparing Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs" id="card_entry_bridge_results">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-neutral-100">
            <div id="bridge_results_header">
              <h3 className="font-sans font-semibold text-neutral-900 text-base tracking-tight">Entry Valuation Bridge & Ratios</h3>
              <p className="text-xs text-neutral-500 mt-1">Side-by-side comparison of EQT baseline and proposed structure.</p>
            </div>
            <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full border border-neutral-100" id="spot_badge">
              Spot JPY/USD: {macro.spotRate}
            </span>
          </div>

          <div className="overflow-x-auto" id="entry_bridge_table_wrapper">
            <table className="w-full border-collapse" id="entry_bridge_table">
              <thead>
                <tr className="border-b border-neutral-100 text-left">
                  <th className="pb-3 text-xs font-semibold text-neutral-500 w-1/3">Transaction Metric / Formula</th>
                  <th className="pb-3 text-xs font-semibold text-neutral-700 font-mono text-right w-1/4">Current Ask Base Case</th>
                  <th className="pb-3 text-xs font-semibold text-emerald-700 font-mono text-right w-1/4">APECS Alternate Proposal</th>
                  <th className="pb-3 text-xs font-semibold text-neutral-500 text-right w-1/4 pl-4">Sheet Row / Formula Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 font-medium text-neutral-800">Indicative Enterprise Value (USD m)</td>
                  <td className="py-2.5 font-mono text-neutral-900 text-right">{formatUSD(valuation.askPriceEvUsd)}</td>
                  <td className="py-2.5 font-mono text-emerald-600 font-semibold text-right">{formatUSD(valuation.proposedEvUsd)}</td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">Model Constant (Input)</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 font-medium text-neutral-800">Enterprise Value (JPY m)</td>
                  <td className="py-2.5 font-mono text-neutral-900 text-right">{formatJPY(bridge.askEvJpy)}</td>
                  <td className="py-2.5 font-mono text-emerald-600 text-right">{formatJPY(bridge.proposedEvJpy)}</td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">EV USD * Spot Rate (B6*B2)</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 text-neutral-500 bg-neutral-50/30">
                  <td className="py-2.5 font-medium">(-) Gross Debt Position (JPY m)</td>
                  <td className="py-2.5 font-mono text-right">{formatJPY(valuation.grossDebtJpy)}</td>
                  <td className="py-2.5 font-mono text-right">{formatJPY(valuation.grossDebtJpy)}</td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">Target Balance Sheet (B8)</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 text-neutral-500 bg-neutral-50/30">
                  <td className="py-2.5 font-medium">(+) Cash & Cash Equivalents (JPY m)</td>
                  <td className="py-2.5 font-mono text-right">{formatJPY(valuation.cashJpy)}</td>
                  <td className="py-2.5 font-mono text-right">{formatJPY(valuation.cashJpy)}</td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">Target Balance Sheet (B9)</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 font-medium text-neutral-800">(=) Net Debt Position (JPY m)</td>
                  <td className="py-2.5 font-mono text-neutral-900 text-right font-semibold">{formatJPY(bridge.netDebtJpy)}</td>
                  <td className="py-2.5 font-mono text-emerald-600 text-right font-semibold">{formatJPY(bridge.netDebtJpy)}</td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">Gross Debt + Cash (B8+B9)</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 bg-neutral-50/50">
                  <td className="py-3 font-semibold text-neutral-900">(=) Implied Equity Value (USD m)</td>
                  <td className="py-3 font-mono text-neutral-900 text-right font-bold">{formatUSD(bridge.askImpliedEquityUsd)}</td>
                  <td className="py-3 font-mono text-emerald-700 text-right font-bold">{formatUSD(bridge.proposedImpliedEquityUsd)}</td>
                  <td className="py-3 font-mono text-neutral-400 text-right pl-4">(EV JPY + Net Debt JPY) / B2</td>
                </tr>
                <tr className="border-t border-neutral-200">
                  <td className="py-2.5 font-medium text-neutral-500">Planned Operating Income (JPY m)</td>
                  <td className="py-2.5 font-mono text-neutral-600 text-right" colSpan={2}>{formatJPY(earnings.operatingIncomeJpy)}</td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">FY25 Planned Operating E&P</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 font-medium text-neutral-500">Depreciation & Amortization (JPY m)</td>
                  <td className="py-2.5 font-mono text-neutral-600 text-right" colSpan={2}>{formatJPY(earnings.daJpy)}</td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">Baseline non-cash charges</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 font-medium text-neutral-800">(=) Estimated EBITDA (JPY m)</td>
                  <td className="py-2.5 font-mono text-neutral-900 text-right font-semibold" colSpan={2}>{formatJPY(bridge.estimatedEbitdaJpy)}</td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">OpInc + D&A (B14+B15)</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 bg-neutral-50/30">
                  <td className="py-2.5 font-medium text-neutral-800">(=) Estimated EBITDA (USD m)</td>
                  <td className="py-2.5 font-sans text-neutral-900 text-right font-semibold" colSpan={2}>
                    <span className="font-mono">{formatUSD(bridge.estimatedEbitdaUsd)}</span>
                    <span className="text-[10px] text-neutral-400 font-sans font-normal ml-1">translated at Avg Rate ({macro.avgRate})</span>
                  </td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">EBITDA JPY / Avg Rate</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 text-neutral-900 bg-neutral-50/40">
                  <td className="py-3 font-semibold">Implied Entry EV/EBITDA Multiple</td>
                  <td className="py-3 font-mono text-right text-red-600 font-bold">{bridge.impliedEntryMultipleAsk.toFixed(2)}x</td>
                  <td className="py-3 font-mono text-right text-emerald-600 font-bold">{bridge.impliedEntryMultipleProposed.toFixed(2)}x</td>
                  <td className="py-3 font-mono text-neutral-400 text-right pl-4">EV USD / EBITDA USD</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 text-neutral-900">
                  <td className="py-2.5 font-medium text-neutral-700">Cross-Currency Core Multiple</td>
                  <td className="py-2.5 font-mono text-right text-red-600">{bridge.crossCurrencyCoreMultipleAsk.toFixed(2)}x</td>
                  <td className="py-2.5 font-mono text-right text-emerald-600">{bridge.crossCurrencyCoreMultipleProposed.toFixed(2)}x</td>
                  <td className="py-2.5 font-mono text-neutral-400 text-right pl-4">EV JPY / EBITDA JPY</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Entry Valuation Waterfall visualizer */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs" id="card_bridge_waterfall_vis">
          <h4 className="font-sans font-semibold text-neutral-900 text-sm mb-4">Entry Bridge Capital Components (USD Millions)</h4>
          
          <div className="space-y-4" id="bridge_waterfall_content">
            {/* Ask case bar breakdown */}
            <div id="vis_ask_case">
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span className="font-medium text-neutral-800">Current Ask Case Base Profile</span>
                <span className="font-mono">Total Capital: {formatUSD(valuation.askPriceEvUsd)}</span>
              </div>
              <div className="w-full h-8 bg-neutral-100 rounded-lg overflow-hidden flex font-mono text-[10px] text-white">
                <div 
                  className="bg-neutral-800 flex items-center justify-center transition-all duration-300" 
                  style={{ width: `${Math.max(10, ((valuation.askPriceEvUsd + (bridge.netDebtJpy / macro.spotRate)) / valuation.askPriceEvUsd) * 100)}%` }}
                  title={`Implied Equity Value: ${formatUSD(bridge.askImpliedEquityUsd)}`}
                >
                  Equity: {formatUSD(bridge.askImpliedEquityUsd)}
                </div>
                <div 
                  className="bg-red-500/85 flex items-center justify-center transition-all duration-300" 
                  style={{ width: `${Math.max(10, (Math.abs(bridge.netDebtJpy / macro.spotRate) / valuation.askPriceEvUsd) * 100)}%` }}
                  title={`Net Debt Portion: ${formatUSD(Math.abs(bridge.netDebtJpy / macro.spotRate))}`}
                >
                  Net Debt: {formatUSD(Math.abs(bridge.netDebtJpy / macro.spotRate))}
                </div>
              </div>
            </div>

            {/* Proposed case bar breakdown */}
            <div id="vis_proposed_case">
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span className="font-medium text-emerald-800">APECS Proposed Value Profile</span>
                <span className="font-mono text-emerald-700">Total Capital: {formatUSD(valuation.proposedEvUsd)}</span>
              </div>
              <div className="w-full h-8 bg-neutral-100 rounded-lg overflow-hidden flex font-mono text-[10px] text-white">
                <div 
                  className="bg-emerald-600 flex items-center justify-center transition-all duration-300" 
                  style={{ width: `${Math.max(10, ((valuation.proposedEvUsd + (bridge.netDebtJpy / macro.spotRate)) / valuation.proposedEvUsd) * 100)}%` }}
                  title={`Implied Equity Value: ${formatUSD(bridge.proposedImpliedEquityUsd)}`}
                >
                  Equity: {formatUSD(bridge.proposedImpliedEquityUsd)}
                </div>
                <div 
                  className="bg-red-500/85 flex items-center justify-center transition-all duration-300" 
                  style={{ width: `${Math.max(10, (Math.abs(bridge.netDebtJpy / macro.spotRate) / valuation.proposedEvUsd) * 100)}%` }}
                  title={`Net Debt Portion: ${formatUSD(Math.abs(bridge.netDebtJpy / macro.spotRate))}`}
                >
                  Net Debt: {formatUSD(Math.abs(bridge.netDebtJpy / macro.spotRate))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-6 text-[10px] text-neutral-500 pt-1" id="vis_legend">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-neutral-800 rounded-xs"></span>
                <span>Ask Equity</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs"></span>
                <span>Proposed Equity</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-red-500/85 rounded-xs"></span>
                <span>Net Debt (Obligations)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
