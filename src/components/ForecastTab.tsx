import React from 'react';
import { YearForecast } from '../types';
import { TrendingUp, Percent, DollarSign, TableProperties, LineChart } from 'lucide-react';

interface ForecastTabProps {
  forecast: YearForecast[];
  niGrowthList: number[];
  setNiGrowthList: React.Dispatch<React.SetStateAction<number[]>>;
  aftGrowthList: number[];
  setAftGrowthList: React.Dispatch<React.SetStateAction<number[]>>;
  ebitdaMargins: number[];
  setEbitdaMargins: React.Dispatch<React.SetStateAction<number[]>>;
  baseNi: number;
  setBaseNi: React.Dispatch<React.SetStateAction<number>>;
  baseAft: number;
  setBaseAft: React.Dispatch<React.SetStateAction<number>>;
}

export const ForecastTab: React.FC<ForecastTabProps> = ({
  forecast,
  niGrowthList,
  setNiGrowthList,
  aftGrowthList,
  setAftGrowthList,
  ebitdaMargins,
  setEbitdaMargins,
  baseNi,
  setBaseNi,
  baseAft,
  setBaseAft,
}) => {
  
  const handleNiGrowthChange = (index: number, valStr: string) => {
    const val = parseFloat(valStr) / 100 || 0;
    setNiGrowthList(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAftGrowthChange = (index: number, valStr: string) => {
    const val = parseFloat(valStr) / 100 || 0;
    setAftGrowthList(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleMarginChange = (index: number, valStr: string) => {
    const val = parseFloat(valStr) / 100 || 0;
    setEbitdaMargins(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const formatUSD = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 1 }).format(num) + ' m';
  };

  // Setup simple SVG Line Chart points
  const maxTotalRevenue = Math.max(...forecast.map(f => f.totalRevenue)) * 1.1;
  const chartHeight = 160;
  const chartWidth = 500;
  const pointsRevenue = forecast.map((f, i) => {
    const x = (i / 5) * (chartWidth - 60) + 40;
    const y = chartHeight - (f.totalRevenue / maxTotalRevenue) * (chartHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  const pointsEbitda = forecast.map((f, i) => {
    const x = (i / 5) * (chartWidth - 60) + 40;
    const y = chartHeight - (f.ebitda / maxTotalRevenue) * (chartHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  const pointsFcf = forecast.map((f, i) => {
    const x = (i / 5) * (chartWidth - 60) + 40;
    const y = chartHeight - (f.fcf / maxTotalRevenue) * (chartHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6" id="forecast_tab_root">
      {/* SECTION 1: Forecasting Spreadsheet Table */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs" id="card_forecast_table">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 mb-4 border-b border-neutral-100 gap-3" id="forecast_header">
          <div>
            <h3 className="font-sans font-semibold text-neutral-900 text-base tracking-tight flex items-center gap-1.5">
              <TableProperties className="w-5 h-5 text-neutral-500" />
              5-Year Operating Forecast Model
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Recalculates revenues, cash margins, capital expenses, and free cash flows dynamically based on growth rates.
            </p>
          </div>
          <div className="flex space-x-3 text-xs" id="base_revenue_inputs">
            <div>
              <span className="text-neutral-500 mr-1.5">Base Year NI:</span>
              <input 
                id="input_base_ni"
                type="number" 
                value={baseNi}
                onChange={e => setBaseNi(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 font-mono rounded bg-neutral-100 border border-neutral-200 focus:outline-hidden"
              />
            </div>
            <div>
              <span className="text-neutral-500 mr-1.5">Base Year AFT:</span>
              <input 
                id="input_base_aft"
                type="number" 
                value={baseAft}
                onChange={e => setBaseAft(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 font-mono rounded bg-neutral-100 border border-neutral-200 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto" id="forecast_table_wrapper">
          <table className="w-full text-xs text-left" id="forecast_table">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50">
                <th className="py-3 px-3 font-semibold text-neutral-600 w-1/4">Line Item / Metric</th>
                <th className="py-3 px-2 font-mono font-semibold text-neutral-900 text-right">Yr 0 (FY25)</th>
                <th className="py-3 px-2 font-mono font-semibold text-neutral-900 text-right">Year 1</th>
                <th className="py-3 px-2 font-mono font-semibold text-neutral-900 text-right">Year 2</th>
                <th className="py-3 px-2 font-mono font-semibold text-neutral-900 text-right">Year 3</th>
                <th className="py-3 px-2 font-mono font-semibold text-neutral-900 text-right">Year 4</th>
                <th className="py-3 px-2 font-mono font-semibold text-emerald-900 text-right">Year 5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {/* Operational Drivers Category Header */}
              <tr className="bg-neutral-50/30 font-semibold text-[11px] text-neutral-400 tracking-wider">
                <td className="py-1 px-3" colSpan={7}>OPERATIONAL DRIVERS (INPUTS)</td>
              </tr>
              {/* Driver 1: NI Growth */}
              <tr>
                <td className="py-2.5 px-3 font-medium text-neutral-800 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-neutral-400" />
                  NI Revenue Growth (%)
                </td>
                <td className="py-2.5 px-2 font-mono text-right text-neutral-500">Baseline</td>
                {niGrowthList.map((val, idx) => (
                  <td key={`ni-g-${idx}`} className="py-2.5 px-1 text-right">
                    <input
                      id={`input_ni_growth_${idx}`}
                      type="number"
                      step="0.1"
                      value={(val * 100).toFixed(1)}
                      onChange={e => handleNiGrowthChange(idx, e.target.value)}
                      className="w-16 px-1.5 py-0.5 font-mono text-right text-xs bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-hidden"
                    />
                  </td>
                ))}
              </tr>
              {/* Driver 2: AFT Growth */}
              <tr>
                <td className="py-2.5 px-3 font-medium text-neutral-800 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-neutral-400" />
                  AFT Portfolio Growth (%)
                </td>
                <td className="py-2.5 px-2 font-mono text-right text-neutral-500">Baseline</td>
                {aftGrowthList.map((val, idx) => (
                  <td key={`aft-g-${idx}`} className="py-2.5 px-1 text-right">
                    <input
                      id={`input_aft_growth_${idx}`}
                      type="number"
                      step="0.1"
                      value={(val * 100).toFixed(1)}
                      onChange={e => handleAftGrowthChange(idx, e.target.value)}
                      className="w-16 px-1.5 py-0.5 font-mono text-right text-xs bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-hidden"
                    />
                  </td>
                ))}
              </tr>
              {/* Driver 3: EBITDA Margin */}
              <tr>
                <td className="py-2.5 px-3 font-medium text-neutral-800 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-neutral-400" />
                  Target EBITDA Margin (%)
                </td>
                {ebitdaMargins.map((val, idx) => (
                  <td key={`eb-m-${idx}`} className="py-2.5 px-1 text-right">
                    <input
                      id={`input_eb_margin_${idx}`}
                      type="number"
                      step="0.1"
                      value={(val * 100).toFixed(2)}
                      onChange={e => handleMarginChange(idx, e.target.value)}
                      className={`w-16 px-1.5 py-0.5 font-mono text-right text-xs bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-hidden ${idx === 5 ? 'border-emerald-500 font-semibold text-emerald-800' : ''}`}
                    />
                  </td>
                ))}
              </tr>

              {/* INCOME STATEMENT ROWS */}
              <tr className="bg-neutral-50/30 font-semibold text-[11px] text-neutral-400 tracking-wider">
                <td className="py-1 px-3" colSpan={7}>INCOME STATEMENT (USD m)</td>
              </tr>
              {/* New Installation Revenue */}
              <tr className="hover:bg-neutral-50/50">
                <td className="py-2 px-3 font-medium text-neutral-800">New Installation Revenue</td>
                {forecast.map((f, i) => (
                  <td key={`ni-rev-${i}`} className="py-2 px-2 font-mono text-right text-neutral-900">
                    {formatUSD(f.niRevenue)}
                  </td>
                ))}
              </tr>
              {/* Aftermarket Service Revenue */}
              <tr className="hover:bg-neutral-50/50">
                <td className="py-2 px-3 font-medium text-neutral-800">Aftermarket Service Revenue</td>
                {forecast.map((f, i) => (
                  <td key={`aft-rev-${i}`} className="py-2 px-2 font-mono text-right text-neutral-900">
                    {formatUSD(f.aftRevenue)}
                  </td>
                ))}
              </tr>
              {/* Total Revenue */}
              <tr className="hover:bg-neutral-50/50 font-semibold bg-neutral-50/50">
                <td className="py-2.5 px-3 text-neutral-900 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
                  Total Revenue
                </td>
                {forecast.map((f, i) => (
                  <td key={`tot-rev-${i}`} className="py-2.5 px-2 font-mono text-right text-neutral-950 font-bold">
                    {formatUSD(f.totalRevenue)}
                  </td>
                ))}
              </tr>
              {/* Total EBITDA */}
              <tr className="hover:bg-neutral-50/50">
                <td className="py-2.5 px-3 font-semibold text-neutral-800">Total EBITDA</td>
                {forecast.map((f, i) => (
                  <td key={`tot-eb-${i}`} className={`py-2.5 px-2 font-mono text-right font-bold ${i === 5 ? 'text-emerald-700 bg-emerald-50/50 border border-emerald-100 rounded-sm' : 'text-neutral-900'}`}>
                    {formatUSD(f.ebitda)}
                  </td>
                ))}
              </tr>
              {/* Depreciation & Amortization */}
              <tr className="hover:bg-neutral-50/50 text-neutral-500 bg-neutral-50/10">
                <td className="py-2 px-3 font-medium pl-6">(-) D&A Expense</td>
                {forecast.map((f, i) => (
                  <td key={`da-exp-${i}`} className="py-2 px-2 font-mono text-right text-red-600">
                    {formatUSD(f.da)}
                  </td>
                ))}
              </tr>
              {/* EBIT */}
              <tr className="hover:bg-neutral-50/50 border-b border-neutral-200">
                <td className="py-2 px-3 font-semibold text-neutral-800">Operating Income (EBIT)</td>
                {forecast.map((f, i) => (
                  <td key={`ebit-${i}`} className="py-2 px-2 font-mono text-right text-neutral-900 font-semibold">
                    {formatUSD(f.ebit)}
                  </td>
                ))}
              </tr>

              {/* FREE CASH FLOW ROWS */}
              <tr className="bg-neutral-50/30 font-semibold text-[11px] text-neutral-400 tracking-wider">
                <td className="py-1 px-3" colSpan={7}>FREE CASH FLOW DRIVERS (OUTFLOWS)</td>
              </tr>
              <tr className="hover:bg-neutral-50/50 text-neutral-500">
                <td className="py-2 px-3 font-medium pl-6">Capital Expenditures (CapEx)</td>
                {forecast.map((f, i) => (
                  <td key={`capex-${i}`} className="py-2 px-2 font-mono text-right text-red-600">
                    {formatUSD(f.capex)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-neutral-50/50 text-neutral-500">
                <td className="py-2 px-3 font-medium pl-6">Change in Net Working Capital</td>
                {forecast.map((f, i) => (
                  <td key={`nwc-${i}`} className="py-2 px-2 font-mono text-right text-red-600">
                    {formatUSD(f.nwcChange)}
                  </td>
                ))}
              </tr>
              {/* FCF Result */}
              <tr className="bg-neutral-900 text-white font-semibold">
                <td className="py-3 px-3 rounded-l-lg flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Free Cash Flow (FCF)
                </td>
                {forecast.map((f, i) => (
                  <td key={`fcf-${i}`} className={`py-3 px-2 font-mono text-right ${i === 5 ? 'rounded-r-lg font-bold text-emerald-300' : ''}`}>
                    {formatUSD(f.fcf)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Dynamic Visual Plot */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs" id="card_forecast_plot">
        <div className="flex items-center space-x-2 pb-3 mb-6 border-b border-neutral-100">
          <span className="p-1.5 bg-neutral-100 text-neutral-700 rounded-lg">
            <LineChart className="w-4 h-4" />
          </span>
          <h3 className="font-sans font-semibold text-neutral-900 text-sm tracking-tight">Financial Projections Trend (Revenue, EBITDA & FCF)</h3>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6" id="forecast_trend_vis">
          {/* Legend and stats */}
          <div className="w-full md:w-1/3 space-y-4" id="forecast_trend_summary">
            <div className="border-l-2 border-neutral-800 pl-3">
              <h4 className="text-xs font-semibold text-neutral-500">Total Revenue Year 5</h4>
              <p className="text-xl font-mono font-bold text-neutral-900">{formatUSD(forecast[5].totalRevenue)}</p>
              <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
                <span>Revenue Curve (grows to {((forecast[5].totalRevenue / forecast[0].totalRevenue - 1) * 100).toFixed(1)}%)</span>
              </div>
            </div>

            <div className="border-l-2 border-emerald-600 pl-3">
              <h4 className="text-xs font-semibold text-neutral-500">EBITDA Year 5</h4>
              <p className="text-xl font-mono font-bold text-emerald-700">{formatUSD(forecast[5].ebitda)}</p>
              <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Margin expands from {forecast[0].ebitdaMargin.toFixed(1)}% to {forecast[5].ebitdaMargin.toFixed(1)}%</span>
              </div>
            </div>

            <div className="border-l-2 border-teal-500 pl-3">
              <h4 className="text-xs font-semibold text-neutral-500">Free Cash Flow Year 5</h4>
              <p className="text-xl font-mono font-bold text-teal-600">{formatUSD(forecast[5].fcf)}</p>
              <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-teal-600">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span>Realized FCF (Yr 1-5 Cumulative: {formatUSD(forecast.slice(1).reduce((acc, curr) => acc + curr.fcf, 0))})</span>
              </div>
            </div>
          </div>

          {/* SVG canvas bar & trend plot */}
          <div className="w-full md:w-2/3 flex justify-center" id="svg_canvas_forecast_wrapper">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-lg h-auto" id="svg_forecast_chart">
              {/* Backing lines */}
              <line x1="40" y1="20" x2={chartWidth - 20} y2="20" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="40" y1={(chartHeight - 40) / 2 + 20} x2={chartWidth - 20} y2={(chartHeight - 40) / 2 + 20} stroke="#f4f4f5" strokeWidth="1" />
              <line x1="40" y1={chartHeight - 20} x2={chartWidth - 20} y2={chartHeight - 20} stroke="#e4e4e7" strokeWidth="1" strokeDasharray="2" />

              {/* Grid Y Axis values */}
              <text x="35" y="24" textAnchor="end" className="fill-neutral-400 font-mono text-[9px]">{formatUSD(maxTotalRevenue * 0.9).split(' ')[0]}</text>
              <text x="35" y={(chartHeight - 40) / 2 + 24} textAnchor="end" className="fill-neutral-400 font-mono text-[9px]">{formatUSD(maxTotalRevenue * 0.5).split(' ')[0]}</text>
              <text x="35" y={chartHeight - 16} textAnchor="end" className="fill-neutral-400 font-mono text-[9px]">$0</text>

              {/* Line 1: Revenue Line */}
              <polyline
                fill="none"
                stroke="#171717"
                strokeWidth="3"
                points={pointsRevenue}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line 2: EBITDA Line */}
              <polyline
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                points={pointsEbitda}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line 3: FCF Line */}
              <polyline
                fill="none"
                stroke="#0d9488"
                strokeWidth="2"
                points={pointsFcf}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Plots dots and labels at year boundaries */}
              {forecast.map((f, i) => {
                const x = (i / 5) * (chartWidth - 60) + 40;
                const yRev = chartHeight - (f.totalRevenue / maxTotalRevenue) * (chartHeight - 40) - 20;
                const yEb = chartHeight - (f.ebitda / maxTotalRevenue) * (chartHeight - 40) - 20;
                
                return (
                  <g key={`dots-${i}`}>
                    <circle cx={x} cy={yRev} r="4" className="fill-neutral-900 border border-white" />
                    <circle cx={x} cy={yEb} r="3.5" className="fill-emerald-600 border border-white" />
                    <text x={x} y={chartHeight - 4} textAnchor="middle" className="fill-neutral-500 font-mono text-[9px]">Yr {i}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
