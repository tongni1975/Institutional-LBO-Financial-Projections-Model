# Institutional LBO & Financial Projections Model

An investment-grade LBO valuation, 5-year operating forecast, waterfall payoff comparison, cap table breakdown, and double-axis sensitivity analysis matrix, fully integrated with dynamic live financial calculations and copy-pasteable formula-ready Google Sheets clipboard hubs.

This professional-grade tool allows users to model a target leverage buyout (LBO) case study comparing a target management **Current Ask Case** against a structured **APECS Alternate Proposal**.

---

## 🚀 Key Functionalities & Features

### 1. Assumptions & Entry Bridge (Tab 1)
* **Macro & FX Rate Inputs**: Real-time adjustable sliders for **Transaction Spot JPY/USD Rate** (for translating entry enterprise value layers and exit proceeds) and **Period Average FX Rate** (for translating historical target operating earnings).
* **Enterprise Valuation Layers**: Detailed input controls for Enterprise Value (EV), Gross Debt, and Target Cash, with automated Net Debt and Implied Equity Value conversions.
* **Entry Multiples Bridge**: Side-by-side transaction metrics (implied entry EV/EBITDA, Cross-Currency core multiples) comparing both proposals.
* **Graphic Capital Bar**: Interactive capital stack breakdown displaying the exact ratios of Implied Equity versus Net Debt Obligations for each scenario.

### 2. 5-Year Operating Forecast Model (Tab 2)
* **Granular Growth Drivers**: Custom yearly percentage input controls for **New Installation (NI)** and **Aftermarket (AFT) Portfolio** growth from Year 1 to Year 5.
* **EBITDA Margin Targets**: Year-by-year margin expansion inputs to evaluate core operating efficiencies.
* **Comprehensive Cash Outputs**: Automatic spreadsheet calculation of Revenue streams, Depreciation & Amortization (D&A), Operating Income (EBIT), Capex, Net Working Capital changes, and realized **Free Cash Flow (FCF)**.
* **SVG Financial Projections Chart**: Custom vector trendlines charting Total Revenue, EBITDA, and Cumulative FCF trends dynamically over the 5-year holding term.

### 3. LBO Waterfall Payoff Comparison (Tab 3)
* **Configurable Exit Multiples**: Dynamic exit enterprise multiple inputs and exit net debt floors to compute final available Exit Equity.
* **Multiple Preferred Share Payoff Modes**:
  * **Converting Preferred**: APECS receives the maximum of the compounding PIK dividend yield (e.g. 8.0%) OR their fully converted common equity share.
  * **Participating Preferred**: Compounding PIK yield liquified first as a priority cushion, plus full pro-rata common conversion on remaining equity.
  * **Calibrated LBO Slide Case**: Calibrated baseline matching institutional targets (21.54% IRR, 2.65x MoIC) to clear approval hurdles.
* **Automated Hurdle Clearance**: Alerts when MoIC / IRR metrics meet or miss the required custom institutional hurdle target rate.

### 4. Post-Investment Capitalization Structure (Tab 4)
* **Management Incentive Pool (MIP)**: Adjustable option pool carve-outs (0-20%) that dilute equity claims.
* **Fully-Diluted Ownership Allocation**: Tabulates cap structures for EQT Partners, APECS Preferred, and the MIP.
* **Dynamic Donut Charts**: Responsive hoverable SVG representation showing exact structural percentage counts and total post-deal valuations.

### 5. Interactive Sensitivity Matrix Heatmap (Tab 5)
* **Dual Coordinate Scales**: Custom vertical row inputs (Implied Entry Multiples) and horizontal coordinates (Exit Multiples).
* **Color-Coded Heat Grid**: Staggered color shading scales visually displaying high performance (emerald), cleared targets, boundaries, and unviable thresholds for **Project IRR (%)**, **MoIC Multiple**, or **Asset Payoff Value**.
* **Cell Spec Sidebar**: Touch or click any of the 25 matrix nodes to instantly inspect exit valuations, available cash equity, and hurdle clearance flags.

### 6. Google Sheets Paste-Hub (Tab 6)
* **Paste-Ready Tabular Formatting**: Generates tab-separated text tables for easy clipboard copy-pasting.
* **True Formula Synchronization**: Pasted cells start at cell `A1` and translate into active formula equations (e.g. `=B6*B2`, `=MAX(C12,C13)`, `=C12+MAX(0,C7-C12)*C10`) directly in modern Google Sheets, avoiding frozen or hardcoded calculation files.

---

## 🛠️ Technology Stack
* **Framework**: React 18+ (Type-Safe TypeScript)
* **Build System**: Vite
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Hosting / Runner**: Standard Node.js Container compatible with production static distributions

---

## 💻 Get Started & Local Setup

Install the package dependencies and run the development server:
```bash
# Install dependencies
npm install

# Run the development environment
npm run dev

# Compile production-ready builds
npm run build
```
The dev server will boot up locally at port `3000`. Open your browser and navigate to `http://localhost:3000` to interact with the modeler.
