import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'earth-numerator-settings'

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

export const useSettingsStore = defineStore('settings', () => {
    const saved = loadFromStorage()

    // ── Player-level persistent settings ──
    // Both values are normalised: 100 = baseline (no bonus/penalty).
    // Attacker weaponTech above 100 → fewer troops needed.
    // Defender defenderWeaponTech above 100 → counters attacker (scales defense up).
    const weaponTech = ref(
        typeof saved.weaponTech === 'number' ? saved.weaponTech :
            (typeof saved.militaryTech === 'number' ? saved.militaryTech : 100)
    )
    const defenderWeaponTech = ref(
        typeof saved.defenderWeaponTech === 'number' ? saved.defenderWeaponTech :
            (typeof saved.defenderTech === 'number' ? saved.defenderTech : 100)
    )

    // ── Persist to localStorage whenever any setting changes ──
    watch(
        () => ({ weaponTech: weaponTech.value, defenderWeaponTech: defenderWeaponTech.value }),
        (values) => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
            } catch {
                // storage unavailable – silently ignore
            }
        },
        { deep: true }
    )

    return { weaponTech, defenderWeaponTech }
})
