import React from 'react';
import { calculateCapTable } from '../utils/finance';
import { Users, PieChart as PieIcon, Settings } from 'lucide-react';

interface CapTableTabProps {
  proposedEv: number;
  apecsCheckSize: number;
  mipPct: number;
  setMipPct: React.Dispatch<React.SetStateAction<number>>;
}

export const CapTableTab: React.FC<CapTableTabProps> = ({
  proposedEv,
  apecsCheckSize,
  mipPct,
  setMipPct,
}) => {
  const capTable = calculateCapTable(proposedEv, apecsCheckSize, mipPct);

  const formatUSD = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 1 }).format(num) + ' m';
  };

  const totalValue = capTable.reduce((acc, curr) => acc + curr.postDealValue, 0);

  // SVG Donut slice coordinates helper
  let cumulativeAngle = 0;
  const donutSlices = capTable.map((item, idx) => {
    const percentage = item.fullyDilutedOwnership / 100;
    const angle = percentage * 360;
    
    // Calculate polar coordinates for SVG paths
    const r = 60; // radius
    const cx = 80;
    const cy = 80;

    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    // Convert angles to radians
    const radStart = (startAngle - 90) * Math.PI / 180;
    const radEnd = (endAngle - 90) * Math.PI / 180;

    const x1 = cx + r * Math.cos(radStart);
    const y1 = cy + r * Math.sin(radStart);
    const x2 = cx + r * Math.cos(radEnd);
    const y2 = cy + r * Math.sin(radEnd);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const colors = [
      'fill-neutral-900 stroke-white stroke-2',       // EQT
      'fill-emerald-600 stroke-white stroke-2',     // APECS
      'fill-neutral-400 stroke-white stroke-2',      // MIP
    ];

    return {
      pathData,
      colorClass: colors[idx],
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="cap_table_tab_root">
      
      {/* LEFT PANEL: Cap Table Parameters */}
      <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-5" id="cap_params_panel">
        <div className="flex items-center space-x-2 pb-3 mb-1 border-b border-neutral-100">
          <span className="p-1.5 bg-neutral-100 text-neutral-700 rounded-lg">
            <Settings className="w-4 h-4" />
          </span>
          <h3 className="font-sans font-semibold text-neutral-900 text-sm tracking-tight">Cap Table Settings</h3>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Proposed Option Pool Size (MIP %)</label>
          <div className="flex items-center space-x-2">
            <input
              id="input_mip_pct"
              type="number"
              step="0.5"
              min="0"
              max="20"
              value={mipPct}
              onChange={e => setMipPct(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-sm font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
            <span className="text-xs font-semibold text-neutral-500 font-mono bg-neutral-100 px-2.5 py-2 rounded-lg border border-neutral-200">% Pool</span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Carved out from EQT common equity during structuring.</p>
        </div>

        <div className="pt-2 text-xs text-neutral-500 space-y-2" id="cap_stats_overview">
          <div className="flex justify-between items-center py-1 border-b border-neutral-100">
            <span>Proposed Enterprise Value:</span>
            <span className="font-mono font-semibold text-neutral-800">{formatUSD(proposedEv)}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-neutral-100">
            <span>APECS Preferred Converted:</span>
            <span className="font-mono font-semibold text-emerald-600">{formatUSD(apecsCheckSize)}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-neutral-100">
            <span>Management Incentive Pool Value:</span>
            <span className="font-mono font-semibold text-neutral-800">{formatUSD(proposedEv * (mipPct / 100))}</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Cap Table Layout and Donut Charts */}
      <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6" id="cap_results_panel">
        
        {/* Cap Table Breakdown */}
        <div className="w-full md:w-3/5 space-y-4" id="cap_table_items_wrapper">
          <div id="cap_header">
            <h3 className="font-sans font-semibold text-neutral-900 text-base tracking-tight flex items-center gap-1.5">
              <Users className="w-5 h-5 text-neutral-500" />
              Post-Deal Capitalization Structure
            </h3>
            <p className="text-xs text-neutral-500 mt-1">Allocation of ownership claims inside the recapitalized capital layers.</p>
          </div>

          <div className="overflow-x-auto" id="cap_table_wrapper">
            <table className="w-full text-xs text-left" id="cap_table">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 font-semibold">
                  <th className="py-2.5 px-1">Shareholder Class</th>
                  <th className="py-2.5 px-1 text-right">Pre-Deal Value %</th>
                  <th className="py-2.5 px-2 text-right">Post-Deal Cap Val</th>
                  <th className="py-2.5 px-1 text-right">Fully-Diluted %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-sans">
                {capTable.map((item, idx) => {
                  const labelColors = [
                    'text-neutral-900 border-neutral-900',  // EQT
                    'text-emerald-700 border-emerald-600',  // APECS
                    'text-neutral-500 border-neutral-400',  // MIP
                  ];

                  return (
                    <tr key={`cap-${idx}`} className="hover:bg-neutral-50/50">
                      <td className="py-2.5 px-1 font-medium text-neutral-800 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-neutral-900' : idx === 1 ? 'bg-emerald-600' : 'bg-neutral-400'}`}></span>
                        {item.classLabel}
                      </td>
                      <td className="py-2.5 px-1 font-mono text-right text-neutral-500">{item.preDealValue.toFixed(2)}%</td>
                      <td className="py-2.5 px-2 font-mono text-right font-semibold text-neutral-900">{formatUSD(item.postDealValue)}</td>
                      <td className={`py-2.5 px-1 font-mono text-right font-bold ${labelColors[idx]}`}>{item.fullyDilutedOwnership.toFixed(2)}%</td>
                    </tr>
                  );
                })}
                <tr className="font-bold border-t border-neutral-200 bg-neutral-50/40">
                  <td className="py-3 px-1 text-neutral-900">Total Capital Structure</td>
                  <td className="py-3 px-1 font-mono text-right text-neutral-500">100.00%</td>
                  <td className="py-3 px-2 font-mono text-right text-neutral-950">{formatUSD(totalValue)}</td>
                  <td className="py-3 px-1 font-mono text-right text-neutral-950">100.00%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cap Table Donut Pie representation */}
        <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-4 bg-neutral-50/30 border border-neutral-100 rounded-2xl" id="donut_chart_wrapper">
          <div className="relative w-40 h-40" id="donut_svg_container">
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
              {donutSlices.map((slice, idx) => (
                <path
                  key={`slice-${idx}`}
                  d={slice.pathData}
                  className={`${slice.colorClass} hover:opacity-90 cursor-pointer transition-opacity duration-150`}
                />
              ))}
              {/* Inner cutout for donut effect */}
              <circle cx="80" cy="80" r="30" fill="white" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight pointer-events-none" id="donut_center_label">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Total EV</span>
              <span className="text-sm font-mono font-extrabold text-neutral-900">{formatUSD(totalValue).split(' m')[0]}m</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-[10px] font-sans font-medium text-neutral-500" id="donut_legend">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-neutral-900 rounded-full"></span>
              <span>EQT ({capTable[0].fullyDilutedOwnership.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
              <span>APECS ({capTable[1].fullyDilutedOwnership.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-neutral-400 rounded-full"></span>
              <span>MIP ({capTable[2].fullyDilutedOwnership.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
