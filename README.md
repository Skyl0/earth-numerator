# 🌍 Earth Numerator – Advanced Attack Calculator

Welcome to **Earth Numerator**, the premium offensive calculation toolkit for Earth Empires. This tool is designed for high-end players who need precision and speed during active warfare.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- `npm` or `yarn`

### Installation
1. Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/Skyl0/earth-numerator.git
cd earth-numerator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## ⚔️ Key Features

- **🚀 Real-time Calculations**: No "Calculate" button needed. See your results the moment you adjust a value.
- **📥 Spy Report Importer**: Import raw HTML spy reports with a single click. No manual data entry for defense totals or tech levels.
- **💾 Persistent Settings**: Your own **Weapon Technology** level is saved automatically to your browser’s local storage.
- **🛡️ Advanced Scaling**: Comprehensive support for **Allied Support**, **Planned Strikes** (×1.5 bonus), and **Troop Readiness** percentages.
- **✨ Premium UI**: A modern, glassmorphic dark theme designed for focus and low eye strain during long war sessions.

---

## 📐 Calculation Logic

The Earth Numerator uses a refined placeholder formula designed to align with the core mechanics of Earth Empires warfare. 

### The Formula:
```
Required Attack = (Defense Value × Ally Factor × Defender Weapon Multiplier) 
                  ÷ (Attacker Weapon Multiplier)
                  ÷ (Planned Strike Multiplier)
                  ÷ (Readiness Percentage)
```

### Factors Breakdown:
| Variable | Value / Logic |
| :------- | :----------- |
| **Ally Factor** | `1.2` if the target has allied support, else `1.0`. |
| **Weapon Tech** | Normalised at 100. (e.g., 150 = ×1.5 strength). |
| **Planned Strike** | Provides a static **×1.5** multiplier to your attacker strength. |
| **Readiness** | Directly reduces your effective combat power if below 100%. |

> **Note**: The results are rounded up to the nearest integer to ensure a successful breakthrough.

---

## 📖 Usage Instructions

1.  **Set Your Tech**: Enter your current **Weapon Technology** level. This is saved across sessions.
2.  **Import Target Data**:
    *   Open a target's spy report in the game.
    *   Right-click $\to$ "View Page Source".
    *   Copy the source and click the **IMPORT** button in the calculator.
3.  **Refine Parameters**: Toggle **Allied Support**, **Planned Strike**, and adjust your **Readiness** if you are attacking before being fully recovered.
4.  **Execute**: Send the **Required Attack Value** shown in green.

---

## 🛠️ Built With

- [Vue 3](https://vuejs.org/) (Composition API / `<script setup>`)
- [Vite](https://vitejs.dev/) (Build Tool)
- [Pinia](https://pinia.vuejs.org/) (State Management & Persistence)
- [Bootstrap 5](https://getbootstrap.com/) (Atomic UI & Grid)
- Custom Vanilla CSS (The Earth Design System)

---

## ⚖️ Background & Philosophy

Earth Numerator was created to solve the "entry lag" problem in online strategy gaming. By moving the calculation logic to the client-side and automating the data entry via raw HTML parsing, we reduce the time-to-strike by over **80%**. 

Our goal is not just to provide a calculator, but to give you a strategic advantage where seconds define victory.

---
*Developed for the Earth Empires community.*
