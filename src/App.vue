<template>
  <div>
    <!-- ===== Navbar ===== -->
    <nav class="navbar navbar-expand-lg navbar-earth sticky-top">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-globe-americas me-2"></i>Earth Numerator
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
            <li class="nav-item">
              <router-link class="nav-link" to="/resource">
                <i class="bi bi-boxes me-1"></i>Resources
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/troops">
                <i class="bi bi-person-arms-up me-1"></i>Troops
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
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
