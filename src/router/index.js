import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AttackCalculator from '../views/AttackCalculator.vue'
const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/attack', name: 'AttackCalculator', component: AttackCalculator },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() { return { top: 0 } },
})

export default router
