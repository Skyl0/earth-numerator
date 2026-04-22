import { ref, computed, watch, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'

export function useAttackCalculator() {
  const settings = useSettingsStore()

  // Transient per-calculation inputs
  const defenseValue = ref(0)
  const hasCustomModifier = ref(false)
  const customModifierValue = ref(10)
  const isTargetDictatorship = ref(false)
  const plannedStrike = ref(false)
  const readiness = ref(100)
  const targetAcres = ref(0)
  const targetUnbuilt = ref(0)
  const result = ref(0)
  const resultReady = ref(false)
  const isCalculating = ref(false)

  const ghostAcresEnabled = ref(false)
  const ghostRatioMode = ref('cheapest')

  const ownBuilt = computed(() => Math.max(0, settings.ownAcres - settings.ownUnbuilt))
  const targetBuilt = computed(() => Math.max(0, targetAcres.value - targetUnbuilt.value))
  
  const ghostUnitsNeeded = computed(() => {
    if (ownBuilt.value > 0 && targetBuilt.value > 0) {
      const atkTechMult = (settings.weaponTech || 100) / 100
      const atkDictFactor = settings.isAttackerDictatorship ? 1.25 : 1.0
      // Formula: (Total Ghost Units) / (Attacker Technology * Attacker Dictatorship Bonus)
      const base = (ownBuilt.value / 20) * targetBuilt.value * 0.032
      return Math.floor(base / (atkTechMult * atkDictFactor))
    }
    return 0
  })

  const ghostRecommendation = computed(() => {
    const G = ghostUnitsNeeded.value
    const R = result.value
    const P = R * 2
    
    if (G <= 0 || R <= 0) return null

    let J = 0
    let T = 0
    let isMixed = false

    if (ghostRatioMode.value === 'cheapest') {
      if (G > R) {
        J = 2 * R - G
        T = 2 * G - 2 * R
        if (J < 0) {
          J = 0
          T = G
        }
        isMixed = true
      } else {
        return null
      }
    } else {
      let r = 0.5
      if (ghostRatioMode.value === '66/33') r = 0.66
      if (ghostRatioMode.value === '75/25') r = 0.75
      
      const U = Math.max(G, P / (r + 1))
      J = r * U
      T = (1 - r) * U
      isMixed = true
    }

    return { jets: Math.ceil(J), troops: Math.ceil(T), isMixed }
  })

  function validateWeaponTech(field) {
    let val = settings[field]
    if (typeof val !== 'number' || isNaN(val)) {
      val = 100
    }
    const validated = Math.round(Math.max(100, val) * 10) / 10
    if (validated !== settings[field]) settings[field] = validated
  }

  function doActualCalculation() {
    if (defenseValue.value <= 0) {
      resultReady.value = false
      result.value = 0
      return
    }

    const modifierFactor = hasCustomModifier.value ? (1 + customModifierValue.value / 100) : 1.0
    const dictFactor = isTargetDictatorship.value ? 1.25 : 1.0
    const atkTechMult = (settings.weaponTech || 100) / 100
    const defTechMult = (settings.defenderWeaponTech || 100) / 100
    const atkDictFactor = settings.isAttackerDictatorship ? 1.25 : 1.0
    const strikeMult = plannedStrike.value ? 1.5 : 1.0
    const readyMult = (readiness.value || 100) / 100

    let calcResult = Math.round(
      (defenseValue.value * modifierFactor * dictFactor * defTechMult) / (atkTechMult * atkDictFactor * strikeMult * readyMult)
    )

    if (!plannedStrike.value) {
      calcResult += 1
    }

    result.value = calcResult
    resultReady.value = true
  }

  function calculate() {
    isCalculating.value = true
    doActualCalculation()
    isCalculating.value = false
  }

  function handleAdvisorImport(advisorImportText) {
    if (!advisorImportText.trim()) return

    const html = advisorImportText

    if (!html.includes('<table') && !html.includes('<html')) {
      throw new Error('Invalid format. Please paste the HTML source of the advisor report.')
    }

    const landMatch = html.match(/<td>Land<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
    if (landMatch) {
      settings.ownAcres = parseInt(landMatch[1].replace(/,/g, ''))
    }

    const unusedMatch = html.match(/<td>Unused Lands<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
    if (unusedMatch) {
      settings.ownUnbuilt = parseInt(unusedMatch[1].replace(/,/g, ''))
    }

    const techMatch = html.match(/<td>Weapons<\/td>\s*<td class='rt'>.*?<\/td>\s*<td class='rt pl'>([\d.]+)%<\/td>/i)
    if (techMatch) {
      settings.weaponTech = parseFloat(techMatch[1])
    }
    
    const dictMatch = html.match(/The Status of the <strong>Dictatorship<\/strong>/i)
    if (dictMatch) {
      settings.isAttackerDictatorship = true
    }

    calculate()
  }

  function handleImport(importText) {
    if (!importText.trim()) return

    const html = importText

    if (!html.includes('<table') && !html.includes('<html')) {
      throw new Error('Invalid format. Please paste the HTML source of the spy report.')
    }

    const techMatch = html.match(/<td>Weapons<\/td>\s*<td class='rt'>.*?<\/td>\s*<td class='rt pl'>([\d.]+)%<\/td>/i)
    if (techMatch) {
      settings.defenderWeaponTech = parseFloat(techMatch[1])
    }

    const defMatch = html.match(/<td>Calc SS Def In Turrets<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
    if (defMatch) {
      defenseValue.value = parseInt(defMatch[1].replace(/,/g, ''))
    } else {
      const troopsMatch = html.match(/<td>Troops<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
      const jetsMatch = html.match(/<td>Jets<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
      const tanksMatch = html.match(/<td>Tanks<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
      
      const troops = troopsMatch ? parseInt(troopsMatch[1].replace(/,/g, '')) : 0
      const jets = jetsMatch ? parseInt(jetsMatch[1].replace(/,/g, '')) : 0
      const tanks = tanksMatch ? parseInt(tanksMatch[1].replace(/,/g, '')) : 0
      
      if (troopsMatch || jetsMatch || tanksMatch) {
        defenseValue.value = (troops + (jets * 2) + (tanks * 4)) / 2
      }
    }

    const allianceMatch = html.match(/<td>Alliance\/GDI<\/td>\s*<td class='rt'>\$([\d,]+)<\/td>/i)
    if (allianceMatch) {
      const expenses = parseInt(allianceMatch[1].replace(/,/g, ''))
      hasCustomModifier.value = expenses > 0
    }

    const dictMatch = html.match(/The Status of the <strong>Dictatorship<\/strong>/i)
    isTargetDictatorship.value = !!dictMatch

    const acresMatch = html.match(/<td>(?:(?:Built )?Acres|Land)<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
    if (acresMatch) {
      targetAcres.value = parseInt(acresMatch[1].replace(/,/g, ''))
    }

    const unbuiltMatch = html.match(/<td>(?:Unbuilt(?: Acres)?|Unused(?: Lands?)?)<\/td>\s*<td class='rt'>([\d,]+)<\/td>/i)
    if (unbuiltMatch) {
      targetUnbuilt.value = parseInt(unbuiltMatch[1].replace(/,/g, ''))
    }

    calculate()
  }

  function reset() {
    settings.reset()
    defenseValue.value = 0
    hasCustomModifier.value = false
    customModifierValue.value = 10
    isTargetDictatorship.value = false
    plannedStrike.value = false
    readiness.value = 100
    ghostAcresEnabled.value = false
    targetAcres.value = 0
    targetUnbuilt.value = 0
    ghostRatioMode.value = 'cheapest'
    result.value = 0
    resultReady.value = false
  }

  // Watch all inputs for changes
  watch(
    [
      defenseValue, 
      hasCustomModifier, 
      customModifierValue,
      isTargetDictatorship,
      plannedStrike, 
      readiness, 
      ghostAcresEnabled,
      () => settings.ownAcres,
      () => settings.ownUnbuilt,
      targetAcres,
      targetUnbuilt,
      () => settings.weaponTech, 
      () => settings.defenderWeaponTech,
      () => settings.isAttackerDictatorship
    ],
    () => {
      calculate()
    }
  )

  onMounted(() => {
    if (defenseValue.value > 0) calculate()
  })

  return {
    settings,
    defenseValue,
    hasCustomModifier,
    customModifierValue,
    isTargetDictatorship,
    plannedStrike,
    readiness,
    targetAcres,
    targetUnbuilt,
    result,
    resultReady,
    isCalculating,
    ghostAcresEnabled,
    ghostRatioMode,
    ownBuilt,
    targetBuilt,
    ghostUnitsNeeded,
    ghostRecommendation,
    validateWeaponTech,
    calculate,
    handleAdvisorImport,
    handleImport,
    reset
  }
}
