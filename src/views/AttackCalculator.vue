<template>
  <div class="container">
    <!-- Page header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="page-title mb-2">
          <i class="bi bi-crosshair2 me-2"></i>Attack Value Calculator
        </h1>
        <p class="page-subtitle mb-0">
          Earth Numerator &mdash; Determine the attack power needed to overcome a target's defenses.
        </p>
      </div>
      <div>
        <button class="btn btn-sm import-btn-premium px-3 py-2" style="font-size: 0.8rem; font-weight: 700; background-color: var(--earth-teal); color: #0d1117; border:none;" @click="isAdvisorModalOpen = true">
          <i class="bi bi-person-badge me-2"></i> IMPORT ADVISOR
        </button>
      </div>
    </div>

    <div class="row g-4">
      <!-- Input card -->
      <div class="col-lg-7">
        <div class="card-earth">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-sliders me-2"></i>Input Parameters</span>
            <div class="import-button-wrapper">
              <div class="import-arrow">
                <i class="bi bi-arrow-right-short"></i>
              </div>
              <button class="btn btn-sm import-btn-premium" style="font-size: 0.75rem; font-weight: 700;" @click="isModalOpen = true">
                <i class="bi bi-download me-1"></i> IMPORT SPY REPORT
              </button>
            </div>
          </div>
          <div class="p-4">
            <!-- Modal for Import Advisor -->
            <div v-if="isAdvisorModalOpen" class="modal-backdrop-earth" @click.self="isAdvisorModalOpen = false">
              <div class="modal-earth">
                <div class="modal-earth-header">
                  <h3 class="modal-earth-title"><i class="bi bi-person-badge me-2"></i>Import Advisor</h3>
                  <button class="btn-close btn-close-white" @click="isAdvisorModalOpen = false"></button>
                </div>
                <div class="modal-earth-body">
                  <p class="mb-3" style="font-size: 0.85rem; color: var(--earth-muted);">
                    Paste the <strong>HTML source</strong> of your Advisor report here.
                    This updates your persistent details (Land, Unused Land, Weapons Tech).
                  </p>
                  <textarea 
                    v-model="advisorImportText" 
                    class="import-textarea" 
                    placeholder="Paste HTML source here..."
                  ></textarea>
                </div>
                <div class="modal-earth-footer">
                  <button class="btn btn-sm btn-outline-secondary" @click="isAdvisorModalOpen = false">Cancel</button>
                  <button class="btn btn-sm btn-earth" @click="handleAdvisorImport" :disabled="!advisorImportText.trim()">
                    Parse & Import
                  </button>
                </div>
              </div>
            </div>
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


            <!-- Dictatorship -->
            <div class="mb-4">
              <label class="form-label">
                <i class="bi bi-flag-fill me-1 text-earth-red"></i>
                Government Type
              </label>
              <div class="card-earth p-3 mt-1">
                <div class="form-check form-switch">
                  <input
                    id="isDictatorship"
                    v-model="isDictatorship"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                  />
                  <label class="form-check-label" for="isDictatorship">
                    Target is a Dictatorship
                    <span v-if="isDictatorship" class="badge ms-2" style="background:var(--earth-red); color:#fff;">
                      +25% DEF
                    </span>
                    <span v-else class="badge ms-2" style="background:var(--earth-border); color:var(--earth-muted);">
                      Neutral
                    </span>
                  </label>
                </div>
                <p class="mb-0 mt-2" style="font-size:.8rem; color:var(--earth-muted);">
                  Dictatorships gain a natural defensive bonus. Auto-detected from spy reports.
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
                  min="100"
                  max="300"
                  step="0.1"
                />
                <span class="input-group-text">%</span>
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
                  min="100"
                  max="300"
                  step="0.1"
                />
                <span class="input-group-text">%</span>
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

            <!-- Has Allies -->
            <div class="mb-4">
              <label class="form-label" style="color: var(--earth-blue);">
                <i class="bi bi-people-fill me-1"></i>
                Alliance Support
              </label>
              <div class="card-earth p-3 mt-1 allied-support-card" :class="{ 'allied-active': hasAllies }">
                <div class="form-check form-switch w-100 mb-0">
                  <input
                    id="hasAllies"
                    v-model="hasAllies"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                  />
                  <label class="form-check-label" for="hasAllies">
                    Target has allied support
                    <span v-if="hasAllies" class="badge ms-2" style="background:var(--earth-blue); color:#fff;">
                      +{{ alliedBonusValue }}% DEF
                    </span>
                    <span v-else class="badge ms-2" style="background:var(--earth-border); color:var(--earth-muted);">
                      None
                    </span>
                  </label>
                </div>
                
                <div v-show="hasAllies" class="mt-3 pt-3 border-top" style="border-color: rgba(255,255,255,0.05) !important;">
                  <div class="alert alert-warning py-2 px-3 mb-3 d-flex align-items-center" style="font-size: 0.8rem; background-color: rgba(210, 153, 34, 0.1); border-color: rgba(210, 153, 34, 0.3); color: var(--earth-amber);">
                    <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <div>
                      <strong>Experimental Feature:</strong> This simply multiplies the target's defense by your selected bonus percentage.
                    </div>
                  </div>
                  <label for="alliedBonusValue" class="form-label mb-1" style="font-size: 0.85rem; color: var(--earth-blue);">Custom Bonus (%)</label>
                  <div class="input-group input-group-sm" style="width: 120px;">
                    <input
                      id="alliedBonusValue"
                      v-model.number="alliedBonusValue"
                      type="number"
                      class="form-control"
                      min="0"
                      step="1"
                    />
                    <span class="input-group-text">%</span>
                  </div>
                </div>

                <p v-show="!hasAllies" class="mb-0 mt-2" style="font-size:.8rem; color:var(--earth-muted);">
                  When enabled, an allied defense bonus will be factored into the calculation.
                </p>
              </div>
            </div>

            <!-- Ghost Acres Inputs -->
            <div class="mb-4">
              <label class="form-label" style="color: var(--earth-pink);">
                <i class="bi bi-geo-alt-fill me-1"></i>
                Ghost Acres Calculation
              </label>
              <div class="card-earth p-3 mt-1 ghost-acres-card" :class="{ 'ghost-active': ghostAcresEnabled }">
                <div class="form-check form-switch mb-3">
                  <input
                    id="ghostAcresEnabled"
                    v-model="ghostAcresEnabled"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                  />
                  <label class="form-check-label" for="ghostAcresEnabled">
                    Enable Ghost Acres Calculation
                    <span v-if="ghostAcresEnabled" class="badge ms-2" style="background:var(--earth-pink); color:#fff;">
                      Active
                    </span>
                    <span v-else class="badge ms-2" style="background:var(--earth-border); color:var(--earth-muted);">
                      Off
                    </span>
                  </label>
                </div>

                <div v-show="ghostAcresEnabled" class="row g-3 border-top pt-3 mt-1" style="border-color: rgba(255,255,255,0.05) !important;">
                  <div class="col-md-6">
                    <label for="ownAcres" class="form-label mb-1" style="font-size: 0.85rem;">Your Total Acres</label>
                    <input
                      id="ownAcres"
                      v-model.number="settings.ownAcres"
                      type="number"
                      class="form-control form-control-sm mb-3"
                      placeholder="e.g. 15000"
                      min="0"
                    />
                    <label for="ownUnbuilt" class="form-label mb-1" style="font-size: 0.85rem;">Your Unbuilt</label>
                    <input
                      id="ownUnbuilt"
                      v-model.number="settings.ownUnbuilt"
                      type="number"
                      class="form-control form-control-sm"
                      placeholder="e.g. 1500"
                      min="0"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="targetAcres" class="form-label mb-1" style="font-size: 0.85rem;">Target Total Acres</label>
                    <input
                      id="targetAcres"
                      v-model.number="targetAcres"
                      type="number"
                      class="form-control form-control-sm mb-3"
                      placeholder="e.g. 20000"
                      min="0"
                    />
                    <label for="targetUnbuilt" class="form-label mb-1" style="font-size: 0.85rem;">Target Unbuilt</label>
                    <input
                      id="targetUnbuilt"
                      v-model.number="targetUnbuilt"
                      type="number"
                      class="form-control form-control-sm"
                      placeholder="e.g. 2000"
                      min="0"
                    />
                  </div>
                  <div class="col-12 mt-2">
                    <p class="mb-0" style="font-size:.8rem; color:var(--earth-muted);">
                      Calculates max ghost troops to send for maximum yield.
                    </p>
                  </div>
                </div>
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
            <div class="result-box" :class="{ 'planned-active': plannedStrike }">
              <div class="result-label">Required Jets or compared to break</div>
              <div
                :class="['result-value', !resultReady ? 'pending' : '']"
                id="attack-result"
              >
                {{ resultReady ? result.toLocaleString() : '— — —' }}
              </div>
            </div>
            
            <div v-if="plannedStrike" class="mt-3 alert alert-info py-2 px-3 d-flex align-items-center" style="font-size: 0.85rem; background-color: rgba(57, 215, 184, 0.1); border-color: rgba(57, 215, 184, 0.3); color: var(--earth-teal);">
              <i class="bi bi-info-circle-fill me-2 fs-5"></i>
              <div>
                <strong>Don't forget!</strong> Make sure to switch to <strong>Planned Strike</strong> while attacking.
              </div>
            </div>
            
            <!-- Max Ghost Acres Result -->
            <div v-if="ghostAcresEnabled && (ownBuilt > 0 || targetBuilt > 0)" class="mt-4 pt-4 border-top" style="border-color:var(--earth-border)!important;">
              <h6 class="mb-3" style="color:var(--earth-pink);"><i class="bi bi-geo-alt-fill me-2"></i>Ghost Acres</h6>
              <div class="d-flex justify-content-between align-items-center">
                <span style="color:var(--earth-muted); font-size: 0.9rem;">Calculated units for maximum gain:</span>
                <strong class="text-earth-teal" style="font-size: 1rem;">
                  {{ (ownBuilt > 0 && targetBuilt > 0) ? Math.floor((ownBuilt / 20) * targetBuilt * 0.032).toLocaleString() : '0' }}
                </strong>
              </div>
              <div class="mt-1 text-end" style="font-size: 0.75rem; color: var(--earth-muted);">
                <em>* Note: these are troops, not turrets (half of jet power).</em>
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
                <strong :class="hasAllies ? 'text-earth-blue' : 'text-earth-green'">
                  {{ hasAllies ? `Yes (+${alliedBonusValue}%)` : 'No' }}
                </strong>
              </li>
              <li class="d-flex justify-content-between py-1 border-bottom" style="border-color:var(--earth-border)!important;">
                <span style="color:var(--earth-muted);">Dictatorship</span>
                <strong :class="isDictatorship ? 'text-earth-red' : 'text-earth-green'">
                  {{ isDictatorship ? 'Yes (+25%)' : 'No' }}
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

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'

// Persistent player settings (survives page refresh via localStorage)
const settings = useSettingsStore()

// Transient per-calculation inputs
const defenseValue  = ref(0)
const hasAllies     = ref(false)
const alliedBonusValue = ref(20)
const isDictatorship = ref(false)
const plannedStrike = ref(false)
const readiness     = ref(100)
const targetAcres = ref(0)
const targetUnbuilt = ref(0)
const result        = ref(0)
const resultReady   = ref(false)

const ghostAcresEnabled = ref(false)
const ownBuilt = computed(() => Math.max(0, settings.ownAcres - settings.ownUnbuilt))
const targetBuilt = computed(() => Math.max(0, targetAcres.value - targetUnbuilt.value))
const isCalculating = ref(false)
const isModalOpen   = ref(false)
const importText    = ref('')

const isAdvisorModalOpen = ref(false)
const advisorImportText  = ref('')

function handleAdvisorImport() {
  if (!advisorImportText.value.trim()) return

  const html = advisorImportText.value

  if (!html.includes('<table') && !html.includes('<html')) {
    alert('Invalid format. Please paste the HTML source of the advisor report.')
    return
  }

  // 1. Extract Land
  const landMatch = html.match(/<td>Land<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
  if (landMatch) {
    settings.ownAcres = parseInt(landMatch[1].replace(/,/g, ''))
  }

  // 2. Extract Unused Lands
  const unusedMatch = html.match(/<td>Unused Lands<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
  if (unusedMatch) {
    settings.ownUnbuilt = parseInt(unusedMatch[1].replace(/,/g, ''))
  }

  // 3. Extract Weapons Tech
  const techMatch = html.match(/<td>Weapons<\/td>\s*<td class='rt'>.*?<\/td>\s*<td class='rt pl'>([\d.]+)%<\/td>/i)
  if (techMatch) {
    settings.weaponTech = parseFloat(techMatch[1])
  }

  advisorImportText.value = ''
  isAdvisorModalOpen.value = false
  calculate()
}

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
  // First try the explicit calculated row if it exists
  const defMatch = html.match(/<td>Calc SS Def In Turrets<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
  if (defMatch) {
    defenseValue.value = parseInt(defMatch[1].replace(/,/g, ''))
  } else {
    // Fallback: calculate from raw units (Troops + Jets * 2 + Tanks * 4)
    const troopsMatch = html.match(/<td>Troops<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
    const jetsMatch = html.match(/<td>Jets<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
    const tanksMatch = html.match(/<td>Tanks<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
    
    const troops = troopsMatch ? parseInt(troopsMatch[1].replace(/,/g, '')) : 0
    const jets = jetsMatch ? parseInt(jetsMatch[1].replace(/,/g, '')) : 0
    const tanks = tanksMatch ? parseInt(tanksMatch[1].replace(/,/g, '')) : 0
    
    // Only update if we successfully found at least some units to prevent wiping out a manually typed 0
    if (troopsMatch || jetsMatch || tanksMatch) {
      defenseValue.value = troops + (jets * 2) + (tanks * 4)
    }
  }

  // 3. Extract Alliance Support
  // Pattern: <td>Alliance\/GDI<\/td> <td class='rt'>$0</td>
  const allianceMatch = html.match(/<td>Alliance\/GDI<\/td>\s*<td class='rt'>\$([\d,]+)<\/td>/i)
  if (allianceMatch) {
    const expenses = parseInt(allianceMatch[1].replace(/,/g, ''))
    hasAllies.value = expenses > 0
  }

  // 4. Extract Dictatorship
  // Pattern: The Status of the <strong>Dictatorship</strong>
  const dictMatch = html.match(/The Status of the <strong>Dictatorship<\/strong>/i)
  isDictatorship.value = !!dictMatch

  // 5. Extract Target Acres
  const acresMatch = html.match(/<td>(?:(?:Built )?Acres|Land)<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
  if (acresMatch) {
    targetAcres.value = parseInt(acresMatch[1].replace(/,/g, ''))
  }

  // 6. Extract Target Unbuilt Acres
  const unbuiltMatch = html.match(/<td>(?:Unbuilt(?: Acres)?|Unused(?: Lands?)?)<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
  if (unbuiltMatch) {
    targetUnbuilt.value = parseInt(unbuiltMatch[1].replace(/,/g, ''))
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
  const allyFactor   = hasAllies.value ? (1 + alliedBonusValue.value / 100) : 1.0
  const dictFactor   = isDictatorship.value ? 1.25 : 1.0
  const atkTechMult  = (settings.weaponTech || 100) / 100
  const defTechMult  = (settings.defenderWeaponTech || 100) / 100
  const strikeMult   = plannedStrike.value ? 1.5 : 1.0
  const readyMult    = (readiness.value || 100) / 100

  let calcResult = Math.round(
    (defenseValue.value * allyFactor * dictFactor * defTechMult) / atkTechMult / strikeMult / readyMult
  )

  if (!plannedStrike.value) {
    calcResult += 1
  }

  result.value = calcResult
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
    alliedBonusValue,
    isDictatorship,
    plannedStrike, 
    readiness, 
    ghostAcresEnabled,
    () => settings.ownAcres,
    () => settings.ownUnbuilt,
    targetAcres,
    targetUnbuilt,
    () => settings.weaponTech, 
    () => settings.defenderWeaponTech
  ],
  () => {
    calculate()
  }
)

// Ensure tech values are rounded to 1 decimal and min 100
watch(() => settings.weaponTech, (val) => {
  if (typeof val === 'number') {
    const rounded = Math.round(Math.max(100, val) * 10) / 10
    if (rounded !== val) settings.weaponTech = rounded
  }
})
watch(() => settings.defenderWeaponTech, (val) => {
  if (typeof val === 'number') {
    const rounded = Math.round(Math.max(100, val) * 10) / 10
    if (rounded !== val) settings.defenderWeaponTech = rounded
  }
})

// Run initial calculation if defense > 0
onMounted(() => {
  if (defenseValue.value > 0) calculate()
})

function reset() {
  settings.reset()
  defenseValue.value  = 0
  hasAllies.value     = false
  alliedBonusValue.value = 20
  isDictatorship.value = false
  plannedStrike.value = false
  readiness.value     = 100
  ghostAcresEnabled.value = false
  targetAcres.value = 0
  targetUnbuilt.value = 0
  result.value        = 0
  resultReady.value   = false
  importText.value    = ''
  advisorImportText.value = ''
}
</script>
