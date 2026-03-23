<template>
  <div class="container">
    <!-- Page header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="page-title mb-2">
          <i class="bi bi-pie-chart-fill me-2"></i>Land Fill Calculator
        </h1>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-secondary px-3 py-2" style="font-size: 0.8rem; font-weight: 700; border: 1px solid var(--earth-border); color: var(--earth-muted); background: rgba(255,255,255,0.05);" @click="reset">
          <i class="bi bi-arrow-counterclockwise me-1"></i> RESET
        </button>
      </div>
    </div>

    <!-- Big Acres Input Field -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card-earth p-4" style="background: linear-gradient(135deg, rgba(57, 215, 184, 0.1) 0%, rgba(28, 35, 51, 0.8) 100%); border: 1px solid rgba(57, 215, 184, 0.3); box-shadow: 0 0 20px rgba(57, 215, 184, 0.1);">
          <div class="row align-items-center">
            <div class="col-md-4 d-flex align-items-center">
              <div>
                <h4 class="mb-1" style="color: var(--earth-teal);"><i class="bi bi-geo-alt-fill me-2"></i>Total Acres</h4>
                <p class="text-muted mb-0" style="font-size: 0.85rem;">Enter your total territory size</p>
              </div>
            </div>
            <div class="col-md-9">
              <div class="row g-3">
                <div class="col-sm-7">
                  <div class="input-group input-group-lg">
                    <input
                      v-model.number="settings.ownAcres"
                      type="number"
                      class="form-control form-control-lg text-white border-0"
                      style="font-size: 2.2rem; font-weight: 800; height: 75px; background: rgba(0,0,0,0.3) !important;"
                      placeholder="0"
                      min="0"
                    />
                    <span class="input-group-text text-white border-0" style="font-size: 1rem; background: rgba(0,0,0,0.4) !important; font-weight: 900;">ACRES</span>
                  </div>
                </div>
                <div class="col-sm-5">
                  <div class="input-group input-group-lg h-100">
                    <input
                      v-model.number="settings.constructionSites"
                      type="number"
                      class="form-control form-control-lg text-white border-0"
                      style="font-size: 1.5rem; font-weight: 700; height: 75px; background: rgba(0,0,0,0.2) !important;"
                      placeholder="0"
                      min="0"
                    />
                    <span class="input-group-text text-white border-0" style="font-size: 0.8rem; background: rgba(0,0,0,0.3) !important; font-weight: 800; line-height: 1.1;">CONSTRUCTION<br>SITES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="row g-4">
      <!-- Calculated Values (Interesting ones first) -->
      <div class="col-12">
        <div class="row g-3">
          <div v-for="type in landTypes" :key="'calc-' + type.key" class="col-6 col-md-4 col-lg-3">
            <div class="card-earth p-3 h-100 text-center result-card-premium" 
                 :style="{ 
                   borderColor: calculatedAcres[type.key] > 0 ? type.color : 'rgba(255,255,255,0.05)',
                   background: calculatedAcres[type.key] > 0 ? hexToRgba(type.color, 0.08) : 'rgba(255,255,255,0.02)'
                 }">
              <div class="d-flex align-items-center justify-content-center mb-2">
                <i :class="['bi', type.icon, 'me-2', type.colorClass]" style="font-size: 1.1rem;"></i>
                <span class="text-white" style="font-size: 0.8rem; font-weight: 700; opacity: 0.9;">{{ type.label }}</span>
              </div>
              <div class="h3 mb-0" :class="calculatedAcres[type.key] > 0 ? 'text-white' : 'text-muted-earth'" style="font-weight: 900; letter-spacing: -0.5px;">
                {{ calculatedAcres[type.key].toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
              </div>
              <div class="mt-1" style="font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.7);">
                <span :class="type.colorClass" style="font-weight: 800;">{{ percentages[type.key].toFixed(1) }}%</span> of total
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Card -->
      <div class="col-lg-7">
        <div class="card-earth">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-sliders me-2"></i>Distribution Inputs</span>
            <span class="badge rounded-pill bg-info bg-opacity-10 text-info" style="font-size: 0.7rem; border: 1px solid rgba(13, 202, 240, 0.2); font-weight: 500;">
              <i class="bi bi-info-circle me-1"></i> Use relative (e.g. 5:2:10) or % (total 100)
            </span>
          </div>
          <div class="p-4">
            <div v-for="type in landTypes" :key="type.key" class="mb-3 land-input-row">
              <div class="row align-items-center">
                <div class="col-md-5">
                  <label :for="type.key" class="form-label mb-0 d-flex align-items-center">
                    <i :class="['bi', type.icon, 'me-2', type.colorClass]"></i>
                    {{ type.label }}
                  </label>
                </div>
                <div class="col-md-7">
                  <div class="input-group">
                    <input
                      :id="type.key"
                      v-model.number="settings.landDistribution[type.key]"
                      type="number"
                      class="form-control"
                      placeholder="0"
                      min="0"
                    />
                    <span class="input-group-text percentage-badge" :class="{ 'has-value': percentages[type.key] > 0 }">
                      {{ percentages[type.key].toFixed(1) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4 pt-3 border-top" style="border-color: rgba(255,255,255,0.05) !important;">
              <div class="d-flex justify-content-between align-items-center">
                <span style="color: var(--earth-muted);">Total Units:</span>
                <strong :class="totalUnits === 100 ? 'text-earth-teal' : 'text-white'">{{ totalUnits.toLocaleString() }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Card / Visual representation -->
      <div class="col-lg-5">
        <div class="card-earth h-100">
          <div class="card-header">
            <i class="bi bi-graph-up me-2"></i>Visual Distribution
          </div>
          <div class="p-4 d-flex flex-column h-100">
            <div v-if="totalUnits > 0" class="distribution-bar-container mb-4">
              <div v-for="type in landTypes" :key="type.key" 
                class="distribution-segment"
                :style="{ 
                  width: percentages[type.key] + '%',
                  backgroundColor: type.color
                }"
                :title="type.label + ': ' + percentages[type.key].toFixed(1) + '%'"
              ></div>
            </div>

            <div v-if="totalUnits > 0" class="flex-grow-1">
              <div v-for="type in sortedLandTypes" :key="type.key" class="mb-2 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="color-dot me-2" :style="{ backgroundColor: type.color }"></div>
                  <span style="font-size: 0.9rem;">{{ type.label }}</span>
                </div>
                <div class="text-end">
                  <span class="fw-bold" style="font-size: 0.9rem;">{{ percentages[type.key].toFixed(1) }}%</span>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center my-auto p-4" style="color: var(--earth-muted);">
              <i class="bi bi-pie-chart" style="font-size: 3rem; opacity: 0.2;"></i>
              <p class="mt-3">Enter values to see the distribution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'

const store = useSettingsStore()
const settings = store

const landTypes = [
  { key: 'enterprise', label: 'Enterprise Zones', icon: 'bi-building-fill', color: '#39d7b8', colorClass: 'text-earth-teal' },
  { key: 'residence', label: 'Residences', icon: 'bi-house-fill', color: '#3b82f6', colorClass: 'text-earth-blue' },
  { key: 'industrial', label: 'Industrial Complexes', icon: 'bi-building', color: '#fbbf24', colorClass: 'text-earth-amber' },
  { key: 'military', label: 'Military Bases', icon: 'bi-airplane-fill', color: '#ef4444', colorClass: 'text-earth-red' },
  { key: 'research', label: 'Research Labs', icon: 'bi-flask', color: '#d946ef', colorClass: 'text-earth-pink' },
  { key: 'farm', label: 'Farms', icon: 'bi-flower3', color: '#10b981', colorClass: 'text-earth-green' },
  { key: 'oil', label: 'Oil Rigs', icon: 'bi-droplet-fill', color: '#6366f1', colorClass: 'text-earth-indigo' }
]

const totalUnits = computed(() => {
  return Object.values(settings.landDistribution).reduce((sum, val) => sum + (Number(val) || 0), 0)
})

const percentages = computed(() => {
  const total = totalUnits.value
  const result = {}
  Object.keys(settings.landDistribution).forEach(key => {
    const val = Number(settings.landDistribution[key]) || 0
    result[key] = total > 0 ? (val / total) * 100 : 0
  })
  return result
})

const sortedLandTypes = computed(() => {
  return [...landTypes].sort((a, b) => percentages.value[b.key] - percentages.value[a.key])
})

const calculatedAcres = computed(() => {
  const totalAcres = Number(settings.ownAcres) || 0
  const construction = Number(settings.constructionSites) || 0
  const availableAcres = Math.max(0, totalAcres - construction)
  const result = {}
  landTypes.forEach(type => {
    result[type.key] = (availableAcres * percentages.value[type.key]) / 100
  })
  return result
})

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function reset() {
  store.reset()
}
</script>

<style scoped>
.land-input-row {
  transition: transform 0.2s ease;
}

.land-input-row:hover {
  transform: translateX(5px);
}

.percentage-badge {
  min-width: 80px;
  justify-content: flex-end;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--earth-muted);
  background-color: rgba(255,255,255,0.02) !important;
  border-left: none !important;
}

.percentage-badge.has-value {
  color: var(--earth-teal);
}

.distribution-bar-container {
  height: 24px;
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  background-color: rgba(255,255,255,0.05);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

.distribution-segment {
  height: 100%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(0,0,0,0.2);
}

.distribution-segment:last-child {
  border-right: none;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.text-earth-indigo { color: #6366f1; }

.card-earth {
  height: 100%;
}

.result-card-premium {
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s ease;
  border-width: 1px;
}

.result-card-premium:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
}
</style>
