<template>
  <div class="container">
    <!-- Hero -->
    <div class="planet-hero">
      <div class="planet-icon">
        <img src="/earth.png" alt="Earth Numerator Logo" style="width: 100px; height: 100px; object-fit: contain; mix-blend-mode: screen; border-radius: 50%;">
      </div>
      <h1 class="page-title mt-3">Earth Numerator</h1>
      <p class="page-subtitle mx-auto" style="max-width:520px;">
        Your all-in-one calculation toolkit for the browser game <strong>Earth</strong>.
        Select a tool below to get started.
      </p>
    </div>

    <!-- Feature cards -->
    <div class="row g-4 justify-content-center">
      <div class="col-sm-6 col-lg-4">
        <router-link to="/attack" class="feature-card">
          <div class="feature-icon text-earth-red">
            <i class="bi bi-crosshair2"></i>
          </div>
          <div class="feature-title">Attack Calculator</div>
          <div class="feature-desc">
            Compute the required attack value against a target's defense,
            factoring in allies and military technology bonuses.
          </div>
        </router-link>
      </div>
    </div>

    <!-- Info banner -->
    <div class="card-earth mt-5 p-4">
      <div class="row align-items-center g-3">
        <div class="col-auto">
          <i class="bi bi-info-circle-fill text-earth-teal" style="font-size:2rem;"></i>
        </div>
        <div class="col">
          <p class="mb-0" style="color:var(--earth-muted); font-size:.9rem;">
            All formulas are community-sourced and may be updated as the game evolves.
            Results are for reference only — always verify in-game before committing resources.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic needed on the home page
</script>
