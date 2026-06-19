import React, { useState } from 'react';
import {
  generateTab1SheetsText,
  generateTab2SheetsText,
  generateTab3SheetsText,
  generateTab4SheetsText,
} from '../utils/finance';
import { MacroAssumptions, IndicativeValuation, BaselineEarnings, WaterfallStructure } from '../types';
import { ClipboardCopy, Check, FileSpreadsheet, Info } from 'lucide-react';

interface SheetsPasteTabProps {
  macro: MacroAssumptions;
  valuation: IndicativeValuation;
  earnings: BaselineEarnings;
  waterfallConfig: WaterfallStructure;
  niGrowthList: number[];
  aftGrowthList: number[];
  ebitdaMargins: number[];
  baseNi: number;
  baseAft: number;
}

export const SheetsPasteTab: React.FC<SheetsPasteTabProps> = ({
  macro,
  valuation,
  earnings,
  waterfallConfig,
  niGrowthList,
  aftGrowthList,
  ebitdaMargins,
  baseNi,
  baseAft,
}) => {
  const [copiedTab, setCopiedTab] = useState<number | null>(null);

  const tab1Text = generateTab1SheetsText(macro, valuation, earnings);
  const tab2Text = generateTab2SheetsText(niGrowthList, aftGrowthList, ebitdaMargins, baseNi, baseAft);
  const tab3Text = generateTab3SheetsText(waterfallConfig);
  const tab4Text = generateTab4SheetsText(valuation.proposedEvUsd);

  const copyToClipboard = (text: string, tabNum: number) => {
    // Format the formulas nicely for Google Sheets (strip space after =)
    const formulaReadyText = text.replace(/=\s+/g, '=');

    navigator.clipboard.writeText(formulaReadyText)
      .then(() => {
        setCopiedTab(tabNum);
        setTimeout(() => setCopiedTab(null), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className="space-y-6" id="sheets_paste_tab_root">
      {/* Notice Card on how to use clipboard copy-paste in Google Sheets */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-xs text-emerald-800 space-y-2.5 flex items-start gap-3" id="sheets_instruction_card">
        <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-emerald-900">Google Sheets Formatting Instructions</h4>
          <p className="opacity-90">
            For each of the calculation workbooks below, click the <strong>"Copy Table"</strong> button and paste directly into Google Sheets starting at cell <strong>A1</strong>. 
            All mathematical cells are converted into real, live spreadsheet formulas (e.g., <code>=B6*B2</code> for Spot Rate Layer). Formula spaces have been stripped out automatically to ensure native evaluation in modern Sheets.
          </p>
        </div>
      </div>

      {/* Grid of four clipboard options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="clipboard_sheets_grid">
        {/* Tab 1 Copy Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="card_copy_tab_1">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tab 1 Workspace</span>
            <h4 className="font-sans font-semibold text-neutral-950 text-sm mt-0.5">Assumptions & Entry Valuation Bridge</h4>
            <p className="text-xs text-neutral-500 mt-1 mb-4">Macro Spot Rate conversions, Target Net Debt positions, JPY EBITDA targets, and raw entry EV/EBITDA valuation multiples.</p>
            
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 max-h-36 overflow-y-auto mb-4" id="preview_tab_1">
              <pre className="text-[10px] font-mono text-neutral-500 whitespace-pre">{tab1Text}</pre>
            </div>
          </div>
          
          <button
            id="btn_copy_tab_1"
            onClick={() => copyToClipboard(tab1Text, 1)}
            className={`w-full py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${copiedTab === 1 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
          >
            {copiedTab === 1 ? (
              <>
                <Check className="w-4 h-4" /> Copied Formula-Ready!
              </>
            ) : (
              <>
                <ClipboardCopy className="w-4 h-4" /> Copy Tab 1 Spreadsheet
              </>
            )}
          </button>
        </div>

        {/* Tab 2 Copy Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="card_copy_tab_2">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tab 2 Workspace</span>
            <h4 className="font-sans font-semibold text-neutral-950 text-sm mt-0.5">5-Year Operating Forecast Model</h4>
            <p className="text-xs text-neutral-500 mt-1 mb-4">Dynamic operational growth drivers, aftermarket compound growth, EBITDA margins expansion, and cumulative Free Cash Flow calculations.</p>
            
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 max-h-36 overflow-y-auto mb-4" id="preview_tab_2">
              <pre className="text-[10px] font-mono text-neutral-500 whitespace-pre">{tab2Text}</pre>
            </div>
          </div>
          
          <button
            id="btn_copy_tab_2"
            onClick={() => copyToClipboard(tab2Text, 2)}
            className={`w-full py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${copiedTab === 2 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
          >
            {copiedTab === 2 ? (
              <>
                <Check className="w-4 h-4" /> Copied Formula-Ready!
              </>
            ) : (
              <>
                <ClipboardCopy className="w-4 h-4" /> Copy Tab 2 Spreadsheet
              </>
            )}
          </button>
        </div>

        {/* Tab 3 Copy Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="card_copy_tab_3">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tab 3 Workspace</span>
            <h4 className="font-sans font-semibold text-neutral-950 text-sm mt-0.5">LBO Waterfall & Capital Payoff structure</h4>
            <p className="text-xs text-neutral-500 mt-1 mb-4">Compares Current Ask Base Case vs. APECS Proposal, incorporating exit multiples, remaining net debt floors, PIK liquidation schedules, MoIC, and IRR hurdle clearance.</p>
            
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 max-h-36 overflow-y-auto mb-4" id="preview_tab_3">
              <pre className="text-[10px] font-mono text-neutral-500 whitespace-pre">{tab3Text}</pre>
            </div>
          </div>
          
          <button
            id="btn_copy_tab_3"
            onClick={() => copyToClipboard(tab3Text, 3)}
            className={`w-full py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${copiedTab === 3 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
          >
            {copiedTab === 3 ? (
              <>
                <Check className="w-4 h-4" /> Copied Formula-Ready!
              </>
            ) : (
              <>
                <ClipboardCopy className="w-4 h-4" /> Copy Tab 3 Spreadsheet
              </>
            )}
          </button>
        </div>

        {/* Tab 4 Copy Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between" id="card_copy_tab_4">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tab 4 Workspace</span>
            <h4 className="font-sans font-semibold text-neutral-950 text-sm mt-0.5">Post-Investment Capitalization Table</h4>
            <p className="text-xs text-neutral-500 mt-1 mb-4">Fully-diluted ownership allocations after preferred deal convertible injection, detailing option pools and partner shares.</p>
            
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 max-h-36 overflow-y-auto mb-4" id="preview_tab_4">
              <pre className="text-[10px] font-mono text-neutral-500 whitespace-pre">{tab4Text}</pre>
            </div>
          </div>
          
          <button
            id="btn_copy_tab_4"
            onClick={() => copyToClipboard(tab4Text, 4)}
            className={`w-full py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${copiedTab === 4 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
          >
            {copiedTab === 4 ? (
              <>
                <Check className="w-4 h-4" /> Copied Formula-Ready!
              </>
            ) : (
              <>
                <ClipboardCopy className="w-4 h-4" /> Copy Tab 4 Spreadsheet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
