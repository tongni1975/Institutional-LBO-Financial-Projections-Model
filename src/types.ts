export interface MacroAssumptions {
  spotRate: number;      // JPY per USD (157.0)
  avgRate: number;       // JPY per USD (150.0)
}

export interface IndicativeValuation {
  askPriceEvUsd: number;      // USD m (4,100.0)
  proposedEvUsd: number;      // USD m (3,150.0) APECS Alternative Proposal
  grossDebtJpy: number;       // JPY m (-25,500.0)
  cashJpy: number;            // JPY m (20,000.0)
}

export interface BaselineEarnings {
  operatingIncomeJpy: number; // JPY m (22,900.0)
  daJpy: number;              // JPY m (4,950.0)
}

export interface YearForecast {
  year: number;               // 0 to 5
  niGrowth?: number;          // % growth in New Installation
  aftGrowth?: number;         // % growth in Aftermarket
  ebitdaMargin: number;       // % EBITDA margin
  niRevenue: number;          // USD m
  aftRevenue: number;         // USD m
  totalRevenue: number;       // USD m
  ebitda: number;             // USD m
  da: number;                 // USD m  (-2% of Revenue)
  ebit: number;               // USD m  (EBITDA + D&A)
  capex: number;              // USD m  (-2.65% of Revenue)
  nwcChange: number;          // USD m  (-0.76% of Revenue)
  fcf: number;                // USD m  (EBIT + CapEx + Change in NWC)
}

export interface WaterfallStructure {
  exitMultiple: number;        // Exit EV Multiple (18.5)
  remainingNetDebtUsd: number; // Remaining Net Debt (-15.0)
  apecsCheckSizeUsd: number;   // APECS Capital Check Size (1000.0)
  pikDividendYield: number;    // Compounding PIK yield floor % (8.0%)
  hurdleRate: number;          // Hurdle rate to pass / fail (8.0% or 20.0%)
  payoffMode: 'converting' | 'participating' | 'calibrated'; // Preferred share type option
}

export interface CapTableItem {
  classLabel: string;
  preDealValue: number;       // prepresented as pct or value
  postDealValue: number;      // USD m
  fullyDilutedOwnership: number; // %
}
