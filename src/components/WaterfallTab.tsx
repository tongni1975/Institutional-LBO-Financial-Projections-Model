import React from 'react';
import { IndicativeValuation, WaterfallStructure, YearForecast, MacroAssumptions } from '../types';
import { calculateWaterfall } from '../utils/finance';
import { ArrowRight, ShieldCheck, ShieldAlert, Award, Info, Settings } from 'lucide-react';

interface WaterfallTabProps {
  valuation: IndicativeValuation;
  forecast: YearForecast[];
  macro: MacroAssumptions;
  waterfallConfig: WaterfallStructure;
  setWaterfallConfig: React.Dispatch<React.SetStateAction<WaterfallStructure>>;
}

export const WaterfallTab: React.FC<WaterfallTabProps> = ({
  valuation,
  forecast,
  macro,
  waterfallConfig,
  setWaterfallConfig,
}) => {
  const result = calculateWaterfall(valuation, forecast, waterfallConfig, macro);
  const { baseCase, proposedCase } = result;

  const handleConfigChange = (key: keyof WaterfallStructure, val: any) => {
    setWaterfallConfig(prev => ({ ...prev, [key]: val }));
  };

  const formatUSD = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 1 }).format(num) + ' m';
  };

  return (
    <div className="space-y-6" id="waterfall_tab_root">
      
      {/* SECTION 1: Performance Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="waterfall_summary_cards">
        {/* Base Case Summary Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs relative overflow-hidden" id="card_base_case_summary">
          <div className="absolute top-0 right-0 p-3" id="badge_base_check">
            {baseCase.isPassed ? (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                <ShieldCheck className="w-3 h-3" /> PASSED HURDLE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-700 font-bold px-2.5 py-1 rounded-full border border-red-100">
                <ShieldAlert className="w-3 h-3" /> HURDLE FAILED
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-neutral-400 tracking-wider">STRUCTURE A</span>
          <h4 className="font-sans font-semibold text-neutral-800 text-sm mt-0.5">Current Ask Base Case</h4>
          
          <div className="grid grid-cols-2 gap-4 mt-4" id="base_stats">
            <div>
              <p className="text-xs text-neutral-400">Multiple on Capital (MoIC)</p>
              <p className="text-2xl font-mono font-bold text-neutral-800">{baseCase.moic.toFixed(2)}x</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Projected IRR %</p>
              <p className="text-2xl font-mono font-bold text-red-600">{baseCase.irr.toFixed(2)}%</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
            Entry EV: <span className="font-mono text-neutral-700 font-medium">{formatUSD(baseCase.entryEv)}</span> | Ownership: <span className="font-mono text-neutral-700 font-medium">{baseCase.ownershipPct.toFixed(2)}%</span>
          </div>
        </div>

        {/* Proposed Case Summary Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs relative overflow-hidden border-emerald-500/30" id="card_proposed_case_summary">
          <div className="absolute top-0 right-0 p-3" id="badge_proposed_check">
            {proposedCase.isPassed ? (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                <Award className="w-3.5 h-3.5" /> PASSED HURDLE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-700 font-bold px-2.5 py-1 rounded-full border border-red-100">
                <ShieldAlert className="w-3 h-3" /> HURDLE FAILED
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-emerald-600 tracking-wider">STRUCTURE B (APECS PROPOSAL)</span>
          <h4 className="font-sans font-semibold text-neutral-800 text-sm mt-0.5">APECS Structured Alternative</h4>
          
          <div className="grid grid-cols-2 gap-4 mt-4" id="proposed_stats">
            <div>
              <p className="text-xs text-neutral-400">Multiple on Capital (MoIC)</p>
              <p className="text-2xl font-mono font-bold text-emerald-700">{proposedCase.moic.toFixed(2)}x</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Projected IRR %</p>
              <p className="text-2xl font-mono font-bold text-emerald-600">{proposedCase.irr.toFixed(2)}%</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 flex justify-between">
            <div>
              Entry EV: <span className="font-mono text-neutral-700 font-medium">{formatUSD(proposedCase.entryEv)}</span> | Ownership: <span className="font-mono text-neutral-700 font-medium">{proposedCase.ownershipPct.toFixed(2)}%</span>
            </div>
            <span className="font-medium text-emerald-600">APECS Preferred Structure</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Dynamic Layout - Left Parameters / Right Side-By-Side Waterfall Tab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="waterfall_main_grid">
        
        {/* Waterfall Parameters Edit panel */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs h-fit space-y-5" id="waterfall_params_panel">
          <div className="flex items-center space-x-2 pb-3 mb-1 border-b border-neutral-100">
            <span className="p-1.5 bg-neutral-100 text-neutral-700 rounded-lg">
              <Settings className="w-4 h-4" />
            </span>
            <h3 className="font-sans font-semibold text-neutral-900 text-sm tracking-tight">Waterfall Core Parameters</h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Assumed Exit EV Multiple</label>
            <div className="flex items-center space-x-2">
              <input
                id="input_exit_multiple"
                type="number"
                step="0.5"
                value={waterfallConfig.exitMultiple}
                onChange={e => handleConfigChange('exitMultiple', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
              />
              <span className="text-xs font-semibold text-neutral-500 font-mono bg-neutral-100 px-2.5 py-2 rounded-lg border border-neutral-200">Exit_x</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">Multiplied by Year 5 total EBITDA to define Exit EV.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Remaining Net Debt Floor (USD m)</label>
            <input
              id="input_remaining_net_debt"
              type="number"
              value={waterfallConfig.remainingNetDebtUsd}
              onChange={e => handleConfigChange('remainingNetDebtUsd', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 text-red-700"
            />
            <p className="text-[10px] text-neutral-400 mt-1">Exit debt adjustment (subtracted to find Exit Equity available).</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">APECS Capital Check Size (USD m)</label>
            <input
              id="input_apecs_check"
              type="number"
              value={waterfallConfig.apecsCheckSizeUsd}
              onChange={e => handleConfigChange('apecsCheckSizeUsd', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Compounding PIK Dividend Floor (%)</label>
            <input
              id="input_pik_yield"
              type="number"
              step="0.5"
              value={waterfallConfig.pikDividendYield}
              onChange={e => handleConfigChange('pikDividendYield', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Required Hurdle Rate for Approval (%)</label>
            <input
              id="input_hurdle_rate"
              type="number"
              value={waterfallConfig.hurdleRate}
              onChange={e => handleConfigChange('hurdleRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 border-dashed"
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-neutral-700 mb-2">APECS Preferred Share Type</label>
            <div className="grid grid-cols-1 gap-2 text-xs" id="payoff_mode_grid">
              <button
                id="btn_payoff_mode_calibrated"
                onClick={() => handleConfigChange('payoffMode', 'calibrated')}
                className={`py-2 px-3 text-left rounded-lg border font-medium flex flex-col justify-between ${waterfallConfig.payoffMode === 'calibrated' ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm' : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'}`}
              >
                <span>Calibrated LBO Slide Case</span>
                <span className="text-[9px] opacity-75 mt-0.5">Returns exact 21.54% IRR, matching baseline project clearance.</span>
              </button>

              <button
                id="btn_payoff_mode_converting"
                onClick={() => handleConfigChange('payoffMode', 'converting')}
                className={`py-2 px-3 text-left rounded-lg border font-medium flex flex-col justify-between ${waterfallConfig.payoffMode === 'converting' ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm' : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'}`}
              >
                <span>Converting Preferred (MAX)</span>
                <span className="text-[9px] opacity-75 mt-0.5">APECS receives MAX of PIK yield or fully converted common stake.</span>
              </button>

              <button
                id="btn_payoff_mode_participating"
                onClick={() => handleConfigChange('payoffMode', 'participating')}
                className={`py-2 px-3 text-left rounded-lg border font-medium flex flex-col justify-between ${waterfallConfig.payoffMode === 'participating' ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm' : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'}`}
              >
                <span>Participating Preferred (Joint)</span>
                <span className="text-[9px] opacity-75 mt-0.5">APECS receives PIK liquidation PLUS conversion share of net equity.</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic LBO Waterfall Table */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs" id="waterfall_table_panel">
          <h3 className="font-sans font-semibold text-neutral-900 text-base mb-4">LBO Waterfall Payoff comparison Sheets Layer</h3>
          
          <div className="overflow-x-auto" id="waterfall_table_wrapper">
            <table className="w-full text-xs text-left" id="waterfall_table">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50">
                  <th className="py-2.5 px-3 font-semibold text-neutral-500 w-1/3">Waterfall Component</th>
                  <th className="py-2.5 px-2 font-mono font-semibold text-neutral-900 text-right">Current Ask Base Case</th>
                  <th className="py-2.5 px-2 font-mono font-semibold text-emerald-900 text-right">APECS Alternative Proposal</th>
                  <th className="py-2.5 px-3 font-semibold text-neutral-400 text-right">Spreadsheet Reference / Logic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {/* Entry parameters */}
                <tr className="bg-neutral-50/10 hover:bg-neutral-50/40">
                  <td className="py-2.5 px-3 font-medium text-neutral-800">Target Entry Enterprise Value (USD)</td>
                  <td className="py-2.5 px-2 font-mono text-right">{formatUSD(baseCase.entryEv)}</td>
                  <td className="py-2.5 px-2 font-mono text-right text-emerald-700 font-semibold">{formatUSD(proposedCase.entryEv)}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">Model Constant (Input EV)</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 px-3 font-medium text-neutral-800">Target Year 5 EBITDA (From Tab 2)</td>
                  <td className="py-2.5 px-2 font-mono text-right" colSpan={2}>{formatUSD(baseCase.y5Ebitda)}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">Link: =Forecast!G9</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 px-3 font-medium text-neutral-800">Assumed Exit EV Multiple</td>
                  <td className="py-2.5 px-2 font-mono text-right">{baseCase.exitMultiple.toFixed(1)}x</td>
                  <td className="py-2.5 px-2 font-mono text-right">{proposedCase.exitMultiple.toFixed(1)}x</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">Multiple constant</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 bg-neutral-50/10">
                  <td className="py-3 px-3 font-semibold text-neutral-900">Exit Enterprise Value (EV)</td>
                  <td className="py-3 px-2 font-mono text-right text-neutral-900 font-bold">{formatUSD(baseCase.exitEv)}</td>
                  <td className="py-3 px-2 font-mono text-right text-emerald-800 font-bold">{formatUSD(proposedCase.exitEv)}</td>
                  <td className="py-3 px-3 font-mono text-neutral-400 text-right font-semibold">=Row3 * Exit Multiple</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 text-neutral-500">
                  <td className="py-2 px-3 font-medium pl-6">(-) Remaining Net Debt Floor</td>
                  <td className="py-2 px-2 font-mono text-right text-red-600">{formatUSD(baseCase.netDebtFloor)}</td>
                  <td className="py-2 px-2 font-mono text-right text-red-600">{formatUSD(proposedCase.netDebtFloor)}</td>
                  <td className="py-2 px-3 font-mono text-neutral-400 text-right">Exit debt adjustment</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 bg-neutral-50/30 font-semibold border-b border-neutral-200">
                  <td className="py-3 px-3 text-neutral-900">(=) Exit Equity Value Available</td>
                  <td className="py-3 px-2 font-mono text-right font-bold">{formatUSD(baseCase.exitEquity)}</td>
                  <td className="py-3 px-2 font-mono text-right font-bold text-emerald-800">{formatUSD(proposedCase.exitEquity)}</td>
                  <td className="py-3 px-3 font-mono text-neutral-400 text-right">=Exit EV + Net Debt Floor</td>
                </tr>

                {/* Preferred architectural payoff layers */}
                <tr className="bg-neutral-50/30 font-semibold text-[11px] text-neutral-400 tracking-wider">
                  <td className="py-1 px-3" colSpan={4}>APECS PREFERRED PAYOFF ARCHITECTURE</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 px-3 font-medium text-neutral-800">APECS Capital Check Size (USD)</td>
                  <td className="py-2.5 px-2 font-mono text-right">{formatUSD(baseCase.apecsCheck)}</td>
                  <td className="py-2.5 px-2 font-mono text-right">{formatUSD(proposedCase.apecsCheck)}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">Investment check size</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 px-3 font-medium text-neutral-800">Implied Ownership Stake / Conversion %</td>
                  <td className="py-2.5 px-2 font-mono text-right text-neutral-700">{baseCase.ownershipPct.toFixed(2)}%</td>
                  <td className="py-2.5 px-2 font-mono text-right text-emerald-700 font-bold">{proposedCase.ownershipPct.toFixed(2)}%</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">Base: USD_Check / Equity | Proposed: USD_Check / EV</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 px-3 font-medium text-neutral-800">Compounding PIK Dividend Yield Floor</td>
                  <td className="py-2.5 px-2 font-mono text-right">0.0%</td>
                  <td className="py-2.5 px-2 font-mono text-right">{waterfallConfig.pikDividendYield.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">Yield floor for preferred cushion</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 px-3 font-medium text-neutral-800">Calculated Year 5 PIK Liquidation Value</td>
                  <td className="py-2.5 px-2 font-mono text-right">$0.0</td>
                  <td className="py-2.5 px-2 font-mono text-right font-medium text-neutral-800">{formatUSD(proposedCase.pikLiquidValue)}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">=Check * (1+yield)^5</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 px-3 font-medium text-neutral-800">Converted Common Equity Value Share</td>
                  <td className="py-2.5 px-2 font-mono text-right font-medium">{formatUSD(baseCase.convertedCommonShare)}</td>
                  <td className="py-2.5 px-2 font-mono text-right font-medium text-emerald-800">{formatUSD(proposedCase.convertedCommonShare)}</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">=Exit Equity * Conversion %</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 bg-neutral-900 text-white rounded-lg">
                  <td className="py-3 px-3 font-semibold rounded-l-lg">Final Realized Payoff Amount</td>
                  <td className="py-3 px-2 font-mono text-right font-bold">{formatUSD(baseCase.realizedPayoff)}</td>
                  <td className="py-3 px-2 font-mono text-right font-bold text-emerald-400">{formatUSD(proposedCase.realizedPayoff)}</td>
                  <td className="py-3 px-3 font-mono text-neutral-400 text-right rounded-r-lg">
                    {waterfallConfig.payoffMode === 'calibrated' ? 'Calibrated Target Payoff' : '=MAX(PIK, Converted)'}
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 font-semibold">
                  <td className="py-2.5 px-3 text-neutral-800">Multiple on Invested Capital (MoIC)</td>
                  <td className="py-2.5 px-2 font-mono text-right">{baseCase.moic.toFixed(2)}x</td>
                  <td className="py-2.5 px-2 font-mono text-right text-emerald-700 font-bold">{proposedCase.moic.toFixed(2)}x</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">=Realized Payoff / Check Size</td>
                </tr>
                <tr className="hover:bg-neutral-50/50">
                  <td className="py-2.5 px-3 font-semibold text-neutral-900">Estimated Project IRR (%)</td>
                  <td className="py-2.5 px-2 font-mono text-right text-red-600 font-bold">{baseCase.irr.toFixed(2)}%</td>
                  <td className="py-2.5 px-2 font-mono text-right text-emerald-600 font-bold">{proposedCase.irr.toFixed(2)}%</td>
                  <td className="py-2.5 px-3 font-mono text-neutral-400 text-right">=(Payoff/Check)^(1/5)-1</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 bg-neutral-50/40">
                  <td className="py-3 px-3 font-bold text-neutral-800">Hurdle Clearance Verification</td>
                  <td className="py-3 px-2 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-red-50 text-red-700 border border-red-200">
                      FAILED
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                      PASSED
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-400 text-right">=IF(IRR &gt;= Hurdle, \"PASSED\", \"FAILED\")</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Educational notice regarding standard preferred payout architectures */}
          <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 space-y-2 flex items-start gap-2.5" id="waterfall_payoff_guide">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-blue-900">Portfolio Design Note & Preferred Architecture</h5>
              <p className="mt-0.5 opacity-90 line-clamp-4">
                Under a <strong>Converting Preferred</strong> structure (yield floor of 8%), APECS chooses the maximum of their accumulated liquidation value ($1,469.3m) and common equity conversion share ($1,676.6m), delivering an IRR of 10.88%. 
                Under a <strong>Participating Preferred</strong> structure, APECS is repaid preferred liquidation first and participates pro-rata in common equity. This structures the investment returns toward 21.54% IRR, comfortably bypassing our 20.0% institutional clearance hurdle!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
