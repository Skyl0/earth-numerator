<script setup>
const isDevBranch = typeof __GIT_BRANCH__ !== 'undefined' && __GIT_BRANCH__ === 'dev'
</script>

<template>
  <div>
    <!-- ===== Navbar ===== -->
    <nav class="navbar navbar-expand-lg navbar-earth sticky-top">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img src="/earth.png" alt="Logo" style="width: 28px; height: 28px; object-fit: contain; mix-blend-mode: screen; border-radius: 50%;" class="me-2"> 
          Earth Numerator
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
    <div v-if="isDevBranch" class="dev-banner">
      <i class="bi bi-exclamation-triangle-fill me-2"></i><strong>DEV BRANCH ACTIVE</strong> &mdash; Features and data may be unstable.
    </div>
  </div>
</template>

<style scoped>
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
