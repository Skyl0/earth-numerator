import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AttackCalculator from '../views/AttackCalculator.vue'
import ResourceCalc from '../views/ResourceCalc.vue'
import TroopStats from '../views/TroopStats.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/attack', name: 'AttackCalculator', component: AttackCalculator },
    { path: '/resource', name: 'ResourceCalc', component: ResourceCalc },
    { path: '/troops', name: 'TroopStats', component: TroopStats },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() { return { top: 0 } },
})

export default router
