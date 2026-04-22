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

    // Own land persistence for Ghost calculations
    const ownAcres = ref(typeof saved.ownAcres === 'number' ? saved.ownAcres : 0)
    const ownUnbuilt = ref(typeof saved.ownUnbuilt === 'number' ? saved.ownUnbuilt : 0)
    const constructionSites = ref(typeof saved.constructionSites === 'number' ? saved.constructionSites : 0)
    const isAttackerDictatorship = ref(!!saved.isAttackerDictatorship)

    // Land Distribution for "Land Fill Calculator"
    const landDistribution = ref(saved.landDistribution || {
        enterprise: 0,
        residence: 0,
        industrial: 0,
        military: 0,
        research: 0,
        farm: 0,
        oil: 0
    })

    // ── Persist to localStorage whenever any setting changes ──
    watch(
        () => ({ 
            weaponTech: weaponTech.value, 
            defenderWeaponTech: defenderWeaponTech.value,
            ownAcres: ownAcres.value,
            ownUnbuilt: ownUnbuilt.value,
            constructionSites: constructionSites.value,
            isAttackerDictatorship: isAttackerDictatorship.value,
            landDistribution: landDistribution.value
        }),
        (values) => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
            } catch {
                // storage unavailable – silently ignore
            }
        },
        { deep: true }
    )

    function reset() {
        weaponTech.value = 100
        defenderWeaponTech.value = 100
        ownAcres.value = 0
        ownUnbuilt.value = 0
        constructionSites.value = 0
        isAttackerDictatorship.value = false
        landDistribution.value = {
            enterprise: 0,
            residence: 0,
            industrial: 0,
            military: 0,
            research: 0,
            farm: 0,
            oil: 0
        }
    }

    return { weaponTech, defenderWeaponTech, ownAcres, ownUnbuilt, constructionSites, isAttackerDictatorship, landDistribution, reset }
})
