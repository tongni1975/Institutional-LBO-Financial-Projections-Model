import { useState } from 'react';
import {
  MacroAssumptions,
  IndicativeValuation,
  BaselineEarnings,
  WaterfallStructure,
} from './types';
import {
  INITIAL_MACRO,
  INITIAL_VALUATION,
  INITIAL_EARNINGS,
  DEFAULT_GROWTH_DRIVERS,
  INITIAL_WATERFALL_CONFIG,
  calculateForecast,
  calculateEntryBridge,
  calculateWaterfall,
} from './utils/finance';
import { AsmTab } from './components/AsmTab';
import { ForecastTab } from './components/ForecastTab';
import { WaterfallTab } from './components/WaterfallTab';
import { CapTableTab } from './components/CapTableTab';
import { SensitivityTab } from './components/SensitivityTab';
import { SheetsPasteTab } from './components/SheetsPasteTab';
import {
  Settings,
  TableProperties,
  TrendingUp,
  FileSpreadsheet,
  Users,
  Percent,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'asm' | 'forecast' | 'waterfall' | 'cap' | 'sens' | 'sheets'>('asm');

  // Core Financial States (Single-source-of-truth)
  const [macro, setMacro] = useState<MacroAssumptions>(INITIAL_MACRO);
  const [valuation, setValuation] = useState<IndicativeValuation>(INITIAL_VALUATION);
  const [earnings, setEarnings] = useState<BaselineEarnings>(INITIAL_EARNINGS);

  const [niGrowthList, setNiGrowthList] = useState<number[]>(DEFAULT_GROWTH_DRIVERS.niGrowthList);
  const [aftGrowthList, setAftGrowthList] = useState<number[]>(DEFAULT_GROWTH_DRIVERS.aftGrowthList);
  const [ebitdaMargins, setEbitdaMargins] = useState<number[]>(DEFAULT_GROWTH_DRIVERS.ebitdaMargins);

  const [baseNi, setBaseNi] = useState<number>(982.5);
  const [baseAft, setBaseAft] = useState<number>(644.2);

  const [waterfallConfig, setWaterfallConfig] = useState<WaterfallStructure>(INITIAL_WATERFALL_CONFIG);
  const [mipPct, setMipPct] = useState<number>(5.0);

  // Computed Values (Derived States)
  const activeGrowthDrivers = {
    niGrowthList,
    aftGrowthList,
    ebitdaMargins,
  };

  const forecast = calculateForecast(activeGrowthDrivers, baseNi, baseAft);
  const bridge = calculateEntryBridge(macro, valuation, earnings);
  const waterfall = calculateWaterfall(valuation, forecast, waterfallConfig, macro);

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-800 font-sans antialiased selection:bg-neutral-900 selection:text-white" id="app_root_container">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40" id="main_app_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div id="header_branding">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 bg-neutral-900 text-white rounded-lg">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
                Institutional LBO & Financial Projections Model
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-medium">
              Case study workbook & modeler comparing the Current Ask vs. APECS Proposed structured deal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs" id="header_live_stats">
            <span className="bg-neutral-50 border border-neutral-200/60 px-3 py-1 rounded-lg text-neutral-500 font-medium">
              EBITDA Margin Exp: <strong className="font-mono text-neutral-800">{(ebitdaMargins[0] * 100).toFixed(1)}% → {(ebitdaMargins[5] * 100).toFixed(1)}%</strong>
            </span>
            <span className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg text-emerald-800 font-medium">
              Proposed Entry EV: <strong className="font-mono text-emerald-950">${valuation.proposedEvUsd.toFixed(1)}m</strong>
            </span>
            <span className="bg-neutral-50 border border-neutral-200/60 px-3 py-1 rounded-lg text-neutral-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              Holding Term: <strong className="font-mono text-neutral-800">5 Yrs</strong>
            </span>
          </div>
        </div>

        {/* NAVIGATION TAB STRIP */}
        <div className="border-t border-neutral-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="navigation_bar">
          <nav className="flex space-x-1 py-2 overflow-x-auto" id="nav_links">
            <button
              id="tab_asm"
              onClick={() => setActiveTab('asm')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${activeTab === 'asm' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <Settings className="w-4 h-4" />
              <span>Assumptions & Entry Bridge</span>
            </button>

            <button
              id="tab_forecast"
              onClick={() => setActiveTab('forecast')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${activeTab === 'forecast' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>5-Year Operating Forecast</span>
            </button>

            <button
              id="tab_waterfall"
              onClick={() => setActiveTab('waterfall')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${activeTab === 'waterfall' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <TableProperties className="w-4 h-4" />
              <span>LBO Waterfall Payoff</span>
            </button>

            <button
              id="tab_cap"
              onClick={() => setActiveTab('cap')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${activeTab === 'cap' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <Users className="w-4 h-4" />
              <span>Post-Investment Capitalization</span>
            </button>

            <button
              id="tab_sens"
              onClick={() => setActiveTab('sens')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${activeTab === 'sens' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <Percent className="w-4 h-4" />
              <span>Sensitivity Matrix</span>
            </button>

            <button
              id="tab_sheets"
              onClick={() => setActiveTab('sheets')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 border border-emerald-500/10 ${activeTab === 'sheets' ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-900 bg-emerald-50/50'}`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Google Sheets Paste-Hub</span>
            </button>
          </nav>
        </div>
      </header>

      {/* DYNAMIC CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main_app_content_scrollable">
        <div className="transition-opacity duration-300" id="tab_renderer_root">
          {activeTab === 'asm' && (
            <AsmTab
              macro={macro}
              setMacro={setMacro}
              valuation={valuation}
              setValuation={setValuation}
              earnings={earnings}
              setEarnings={setEarnings}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastTab
              forecast={forecast}
              niGrowthList={niGrowthList}
              setNiGrowthList={setNiGrowthList}
              aftGrowthList={aftGrowthList}
              setAftGrowthList={setAftGrowthList}
              ebitdaMargins={ebitdaMargins}
              setEbitdaMargins={setEbitdaMargins}
              baseNi={baseNi}
              setBaseNi={setBaseNi}
              baseAft={baseAft}
              setBaseAft={setBaseAft}
            />
          )}

          {activeTab === 'waterfall' && (
            <WaterfallTab
              valuation={valuation}
              forecast={forecast}
              macro={macro}
              waterfallConfig={waterfallConfig}
              setWaterfallConfig={setWaterfallConfig}
            />
          )}

          {activeTab === 'cap' && (
            <CapTableTab
              proposedEv={valuation.proposedEvUsd}
              apecsCheckSize={waterfallConfig.apecsCheckSizeUsd}
              mipPct={mipPct}
              setMipPct={setMipPct}
            />
          )}

          {activeTab === 'sens' && (
            <SensitivityTab
              forecast={forecast}
              macro={macro}
              valuation={valuation}
              waterfallConfig={waterfallConfig}
            />
          )}

          {activeTab === 'sheets' && (
            <SheetsPasteTab
              macro={macro}
              valuation={valuation}
              earnings={earnings}
              waterfallConfig={waterfallConfig}
              niGrowthList={niGrowthList}
              aftGrowthList={aftGrowthList}
              ebitdaMargins={ebitdaMargins}
              baseNi={baseNi}
              baseAft={baseAft}
            />
          )}
        </div>
      </main>

      {/* DASHBOARD COMPACT FOOTER */}
      <footer className="bg-white border-t border-neutral-200 mt-12 py-6 text-center text-xs text-neutral-400" id="main_app_footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans font-medium hover:text-neutral-600 transition-colors">
            © 2026 Institutional Private Equity Deal Modeler. Prepared for investment committee review.
          </p>
          <div className="flex items-center space-x-1 text-[11px] text-neutral-400 font-mono" id="footer_calibration_stamp">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Calibration Status: Models synchronized with paste-ready configurations</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
