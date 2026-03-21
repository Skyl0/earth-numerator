<template>
  <div class="container">
    <!-- Page header -->
    <h1 class="page-title">
      <i class="bi bi-crosshair2 me-2"></i>Attack Value Calculator
    </h1>
    <p class="page-subtitle">
      Earth Numerator &mdash; Determine the attack power needed to overcome a target's defenses.
    </p>

    <div class="row g-4">
      <!-- Input card -->
      <div class="col-lg-7">
        <div class="card-earth">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-sliders me-2"></i>Input Parameters</span>
            <button class="btn btn-sm btn-outline-teal" style="font-size: 0.75rem; font-weight: 700;" @click="isModalOpen = true">
              <i class="bi bi-download me-1"></i> IMPORT SPY REPORT
            </button>
          </div>
          <div class="p-4">
            <!-- Modal for Import -->
            <div v-if="isModalOpen" class="modal-backdrop-earth" @click.self="isModalOpen = false">
              <div class="modal-earth">
                <div class="modal-earth-header">
                  <h3 class="modal-earth-title"><i class="bi bi-file-earmark-code me-2"></i>Import Spy Report</h3>
                  <button class="btn-close btn-close-white" @click="isModalOpen = false"></button>
                </div>
                <div class="modal-earth-body">
                  <p class="mb-3" style="font-size: 0.85rem; color: var(--earth-muted);">
                    Paste the <strong>HTML source</strong> of a successful spy report here.
                    The calculator will automatically extract defense values, alliance support, and technology levels.
                  </p>
                  <textarea 
                    v-model="importText" 
                    class="import-textarea" 
                    placeholder="Paste HTML source here..."
                  ></textarea>
                </div>
                <div class="modal-earth-footer">
                  <button class="btn btn-sm btn-outline-secondary" @click="isModalOpen = false">Cancel</button>
                  <button class="btn btn-sm btn-earth" @click="handleImport" :disabled="!importText.trim()">
                    Parse & Import
                  </button>
                </div>
              </div>
            </div>

            <!-- Defense Value -->
            <div class="mb-4">
              <label for="defenseValue" class="form-label">
                <i class="bi bi-shield-fill-x me-1 text-earth-red"></i>
                Defense Value (Target)
              </label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-shield-fill-x text-earth-red"></i>
                </span>
                <input
                  id="defenseValue"
                  v-model.number="defenseValue"
                  type="number"
                  class="form-control"
                  placeholder="e.g. 250000"
                  min="0"
                  step="1000"
                />
              </div>
              <div class="form-text" style="color:var(--earth-muted);">
                The total defense score shown on the target's profile.
              </div>
            </div>

            <!-- Has Allies -->
            <div class="mb-4">
              <label class="form-label">
                <i class="bi bi-people-fill me-1 text-earth-blue"></i>
                Alliance Support
              </label>
              <div class="card-earth p-3 mt-1">
                <div class="form-check form-switch">
                  <input
                    id="hasAllies"
                    v-model="hasAllies"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                  />
                  <label class="form-check-label" for="hasAllies">
                    Target has allied support
                    <span v-if="hasAllies" class="badge ms-2" style="background:var(--earth-red); color:#fff;">
                      Active
                    </span>
                    <span v-else class="badge ms-2" style="background:var(--earth-border); color:var(--earth-muted);">
                      None
                    </span>
                  </label>
                </div>
                <p class="mb-0 mt-2" style="font-size:.8rem; color:var(--earth-muted);">
                  When enabled, the allied defense bonus will be factored into the calculation.
                </p>
              </div>
            </div>

            <!-- Military Tech -->
            <div class="mb-4">
              <label for="militaryTech" class="form-label">
                <i class="bi bi-cpu me-1 text-earth-teal"></i>
                Your Weapon Technology
              </label>
              <div class="input-group">
                <input
                  id="weaponTech"
                  v-model.number="settings.weaponTech"
                  type="number"
                  class="form-control"
                  placeholder="100"
                  min="0"
                  max="300"
                  step="0.01"
                />
                <span class="input-group-text">%</span>
              </div>
              <div class="form-text" style="color:var(--earth-muted);">
                Normalised scale: <strong style="color:var(--earth-teal);">100</strong> = baseline.
                Higher values (e.g. 150) reduce the raw attack needed; lower values increase it.
              </div>
            </div>

            <!-- Defender Military Tech -->
            <div class="mb-4">
              <label for="defenderTech" class="form-label">
                <i class="bi bi-shield-shaded me-1 text-earth-red"></i>
                Defender Weapon Technology
              </label>
              <div class="input-group">
                <input
                  id="defenderWeaponTech"
                  v-model.number="settings.defenderWeaponTech"
                  type="number"
                  class="form-control"
                  placeholder="100"
                  min="0"
                  max="300"
                  step="0.01"
                />
                <span class="input-group-text">%</span>
              </div>
              <div class="form-text" style="color:var(--earth-muted);">
                Normalised scale: <strong style="color:var(--earth-red);">100</strong> = baseline.
                Higher defender tech counters your attack; lower defender tech gives you an edge.
              </div>
            </div>

            <!-- Planned Strike -->
            <div class="mb-4">
              <label class="form-label">
                <i class="bi bi-bullseye me-1 text-earth-amber"></i>
                Strike Type
              </label>
              <div class="card-earth p-3 mt-1 planned-strike-card" :class="{ 'planned-active': plannedStrike }">
                <div class="form-check form-switch">
                  <input
                    id="plannedStrike"
                    v-model="plannedStrike"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                  />
                  <label class="form-check-label" for="plannedStrike">
                    Planned Strike
                    <span v-if="plannedStrike" class="badge ms-2" style="background:var(--earth-amber); color:#0d1117;">
                      +50% ATK
                    </span>
                    <span v-else class="badge ms-2" style="background:var(--earth-border); color:var(--earth-muted);">
                      Off
                    </span>
                  </label>
                </div>
                <p class="mb-0 mt-2" style="font-size:.8rem; color:var(--earth-muted);">
                  A planned strike multiplies your attacker strength by <strong style="color:var(--earth-amber);">×1.5</strong>
                  (50% bonus), so you need fewer raw troops to reach the required attack value.
                </p>
              </div>
            </div>

            <!-- Readiness -->
            <div class="mb-4">
              <label for="readiness" class="form-label">
                <i class="bi bi-battery-charging me-1 text-earth-green"></i>
                Troop Readiness
              </label>
              <div class="input-group">
                <input
                  id="readiness"
                  v-model.number="readiness"
                  type="number"
                  class="form-control"
                  placeholder="99"
                  min="1"
                  max="100"
                  step="1"
                />
                <span class="input-group-text">%</span>
              </div>
              <div class="form-text" style="color:var(--earth-muted);">
                At <strong style="color:var(--earth-green);">100%</strong> your troops fight at full strength.
                Lower readiness means you need proportionally more raw attack to compensate.
              </div>
            </div>

            <!-- Action -->
            <div class="d-flex gap-3 flex-wrap">
              <button class="btn btn-outline-secondary" @click="reset" id="btn-reset">
                <i class="bi bi-arrow-counterclockwise me-2"></i>Reset All Fields
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Result card -->
      <div class="col-lg-5 d-flex flex-column gap-4">
        <!-- Result -->
        <div class="card-earth">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-graph-up-arrow me-2"></i>Result</span>
            <div v-if="isCalculating" class="spinner-border spinner-border-sm text-earth-teal" role="status">
              <span class="visually-hidden">Calculating...</span>
            </div>
            <span v-else-if="resultReady" class="badge rounded-pill bg-success" style="font-size: 0.65rem;">Updated</span>
          </div>
          <div class="p-4">
            <div class="result-box">
              <div class="result-label">Required Attack Value</div>
              <div
                :class="['result-value', !resultReady ? 'pending' : '']"
                id="attack-result"
              >
                {{ resultReady ? result.toLocaleString() : '— — —' }}
              </div>
              <div v-if="resultReady" class="mt-2" style="font-size:.8rem; color:var(--earth-muted);">
                ≈ {{ (result / 1000).toFixed(1) }}k attack power needed
              </div>
            </div>
          </div>
        </div>

        <!-- Summary panel -->
        <div class="card-earth" v-if="resultReady">
          <div class="card-header">
            <i class="bi bi-list-check me-2"></i>Calculation Summary
          </div>
          <div class="p-4">
            <ul class="list-unstyled mb-0" style="font-size:.875rem;">
              <li class="d-flex justify-content-between py-1 border-bottom" style="border-color:var(--earth-border)!important;">
                <span style="color:var(--earth-muted);">Defense value</span>
                <strong>{{ defenseValue.toLocaleString() }}</strong>
              </li>
              <li class="d-flex justify-content-between py-1 border-bottom" style="border-color:var(--earth-border)!important;">
                <span style="color:var(--earth-muted);">Allied support</span>
                <strong :class="hasAllies ? 'text-earth-red' : 'text-earth-green'">
                  {{ hasAllies ? 'Yes' : 'No' }}
                </strong>
              </li>
              <li class="d-flex justify-content-between py-1 border-bottom" style="border-color:var(--earth-border)!important;">
                <span style="color:var(--earth-muted);">Your weapon tech</span>
                <strong class="text-earth-teal">{{ settings.weaponTech }}%</strong>
              </li>
              <li class="d-flex justify-content-between py-1 border-bottom" style="border-color:var(--earth-border)!important;">
                <span style="color:var(--earth-muted);">Defender weapon tech</span>
                <strong class="text-earth-red">{{ settings.defenderWeaponTech }}%</strong>
              </li>
              <li class="d-flex justify-content-between py-1 border-bottom" style="border-color:var(--earth-border)!important;">
                <span style="color:var(--earth-muted);">Planned strike</span>
                <strong :style="plannedStrike ? 'color:var(--earth-amber)' : 'color:var(--earth-green)'">
                  {{ plannedStrike ? 'Yes (×1.5)' : 'No' }}
                </strong>
              </li>
              <li class="d-flex justify-content-between py-1 border-bottom" style="border-color:var(--earth-border)!important;">
                <span style="color:var(--earth-muted);">Readiness</span>
                <strong :style="readiness < 100 ? 'color:var(--earth-amber)' : 'color:var(--earth-green)'">
                  {{ readiness }}%
                </strong>
              </li>
              <li class="d-flex justify-content-between py-1">
                <span style="color:var(--earth-muted);">Attack needed</span>
                <strong class="text-earth-green">{{ result.toLocaleString() }}</strong>
              </li>
            </ul>
          </div>
        </div>

        <!-- Placeholder when no result -->
        <div v-else class="card-earth p-4 text-center" style="color:var(--earth-muted);">
          <i class="bi bi-keyboard" style="font-size:2rem;"></i>
          <p class="mt-2 mb-0" style="font-size:.875rem;">
            Enter a <strong>Defense Value</strong> to see the required attack power automatically.
          </p>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="card-earth mt-4 p-4">
      <h2 class="text-earth-blue mb-3" style="font-size:1rem; font-weight:700;">
        <i class="bi bi-journal-text me-2"></i>Formula Notes
      </h2>
      <p style="color:var(--earth-muted); font-size:.875rem; margin-bottom:0;">
        The actual formula will be implemented once the game mechanics are confirmed.
        Currently the calculator uses a <em>placeholder</em> calculation:<br/>
        <code style="color:var(--earth-teal);">Attack = Defense &times; allyFactor &times; (defenderWeaponTech / 100) &divide; (weaponTech / 100) &divide; plannedStrikeMult &divide; (readiness / 100)</code>.
        Both tech values are <strong style="color:var(--earth-teal);">normalised</strong> at 100&nbsp;=&nbsp;baseline. Defender tech above 100 counters your attack;
        your weapon tech above 100 reduces the troops required. Planned Strike &times;1.5. Readiness below 100% increases the raw attack needed proportionally.
        Update <code>AttackCalculator.vue</code> when the real formula is known.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'

// Persistent player settings (survives page refresh via localStorage)
const settings = useSettingsStore()

// Transient per-calculation inputs
const defenseValue  = ref(0)
const hasAllies     = ref(false)
const plannedStrike = ref(false)
const readiness     = ref(99)
const result        = ref(0)
const resultReady   = ref(false)
const isCalculating = ref(false)
const isModalOpen   = ref(false)
const importText    = ref('')

let calcTimeout = null

function handleImport() {
  if (!importText.value.trim()) return

  const html = importText.value

  // Check for basic HTML structure (basic heuristic)
  if (!html.includes('<table') && !html.includes('<html')) {
    alert('Invalid format. Please paste the HTML source of the spy report.')
    return
  }

  // 1. Extract Weapon Tech
  // Pattern: <td>Weapons</td> ... <td class='rt pl'>102.2%</td>
  const techMatch = html.match(/<td>Weapons<\/td>\s*<td class='rt'>.*?<\/td>\s*<td class='rt pl'>([\d.]+)%<\/td>/i)
  if (techMatch) {
    settings.defenderWeaponTech = parseFloat(techMatch[1])
  }

  // 2. Extract Defense Value
  // Pattern: <td>Calc SS Def In Turrets</td> <td class='rt'>1,163,077</td>
  const defMatch = html.match(/<td>Calc SS Def In Turrets<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
  if (defMatch) {
    defenseValue.value = parseInt(defMatch[1].replace(/,/g, ''))
  }

  // 3. Extract Alliance Support
  // Pattern: <td>Alliance\/GDI<\/td> <td class='rt'>$0</td>
  const allianceMatch = html.match(/<td>Alliance\/GDI<\/td>\s*<td class='rt'>\$([\d,]+)<\/td>/i)
  if (allianceMatch) {
    const expenses = parseInt(allianceMatch[1].replace(/,/g, ''))
    hasAllies.value = expenses > 0
  }

  // Success: reset modal
  importText.value = ''
  isModalOpen.value = false
  calculate() // Refresh result
}

function doActualCalculation() {
  if (defenseValue.value <= 0) {
    resultReady.value = false
    result.value = 0
    return
  }

  // ── Placeholder formula – replace with real game logic ──
  const allyFactor   = hasAllies.value ? 1.2 : 1.0
  const atkTechMult  = (settings.weaponTech || 100) / 100
  const defTechMult  = (settings.defenderWeaponTech || 100) / 100
  const strikeMult   = plannedStrike.value ? 1.5 : 1.0
  const readyMult    = (readiness.value || 99) / 100

  result.value      = Math.round(
    (defenseValue.value * allyFactor * defTechMult) / atkTechMult / strikeMult / readyMult
  )
  resultReady.value = true
}

function calculate() {
  isCalculating.value = true
  
  // Clear any existing timeout
  if (calcTimeout) clearTimeout(calcTimeout)
  
  // Enforce minimum spinner time of 250ms for visual feedback
  calcTimeout = setTimeout(() => {
    doActualCalculation()
    isCalculating.value = false
  }, 250)
}

// Watch all inputs for changes
watch(
  [
    defenseValue, 
    hasAllies, 
    plannedStrike, 
    readiness, 
    () => settings.weaponTech, 
    () => settings.defenderWeaponTech
  ],
  () => {
    calculate()
  }
)

// Run initial calculation if defense > 0
onMounted(() => {
  if (defenseValue.value > 0) calculate()
})

function reset() {
  defenseValue.value  = 0
  hasAllies.value     = false
  plannedStrike.value = false
  readiness.value     = 99
  result.value        = 0
  resultReady.value   = false
  // weaponTech / defenderWeaponTech are intentionally NOT reset – persistent player settings
}
</script>
