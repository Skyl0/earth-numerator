<script setup>
import { ref, onMounted } from 'vue'

const isDevBranch = typeof __GIT_BRANCH__ !== 'undefined' && __GIT_BRANCH__ === 'dev'
const isProd = import.meta.env.PROD
const isProdMode = import.meta.env.VITE_PROD === '1'
const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0'
const buildDate = typeof __APP_BUILD_DATE__ !== 'undefined' ? __APP_BUILD_DATE__ : ''

const dynamicStars = ref([])

onMounted(() => {
  const count = 400
  for (let i = 0; i < count; i++) {
    dynamicStars.value.push({
      size: Math.random() * 2 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 60 + 40,
      delay: Math.random() * 20
    })
  }
})
</script>

<template>
  <div>
    <!-- Starfield Background -->
    <div class="starfield">
      <div class="star-twinkle">
        <div class="stars-layer stars-small"></div>
        <div class="stars-layer stars-medium"></div>
        
        <!-- Dynamic JS-style stars -->
        <div 
          v-for="(star, index) in dynamicStars" 
          :key="index"
          class="star"
          :style="{
            width: star.size + 'px',
            height: star.size + 'px',
            left: star.left + 'vw',
            top: star.top + 'vh',
            animationDuration: star.duration + 's',
            animationDelay: star.delay + 's'
          }"
        ></div>
      </div>
    </div>
    
    <div class="content-wrapper">

    <!-- ===== Navbar ===== -->
    <nav class="navbar navbar-expand-lg navbar-earth sticky-top">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" :class="{ 'is-prod': isProdMode }" to="/">
          <img src="/earth.png" alt="Logo" style="width: 28px; height: 28px; object-fit: contain; mix-blend-mode: screen; border-radius: 50%;" class="me-2"> 
          Earth Numerator
          <span v-if="isProdMode" class="live-chip">LIVE</span>
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="bi bi-list" style="color: var(--earth-muted); font-size:1.4rem;"></i>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto gap-1">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="bi bi-house-door me-1"></i>Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/attack">
                <i class="bi bi-crosshair me-1"></i>Attack Calc
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- ===== Page content ===== -->
    <main class="page-wrapper">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- ===== Footer ===== -->
    <footer>
      Earth Numerator &mdash; Utility toolkit for the browser game <em>Earth</em>
    </footer>
    <!-- ===== Dev Branch Banner ===== -->

    <!-- ===== Version Indicator ===== -->
    <div v-if="isProd" class="version-indicator">
      {{ appVersion }}_{{ buildDate }}
    </div>
    </div>
  </div>
</template>

<style scoped>
.version-indicator {
  position: fixed;
  bottom: 6px;
  right: 12px;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.25);
  pointer-events: none;
  z-index: 9999;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.8);
}
.dev-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--earth-amber);
  color: #0d1117;
  text-align: center;
  padding: 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
  z-index: 9999;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
