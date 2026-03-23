<template>
  <div class="container">
    <!-- Hero -->
    <div class="planet-hero">
      <div class="planet-icon">
        <img src="/earth_trans.png" alt="Earth Numerator Logo" style="width: 300px; height: 300px; object-fit: contain; mix-blend-mode: screen; border-radius: 50%;">
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

      <div class="col-sm-6 col-lg-4">
        <router-link to="/land-fill" class="feature-card">
          <div class="feature-icon text-earth-teal">
            <i class="bi bi-pie-chart-fill"></i>
          </div>
          <div class="feature-title">Land Distribution</div>
          <div class="feature-desc">
            Plan your land distribution using relative numbers or percentages.
            Automatically calculates the resulting proportions.
          </div>
        </router-link>
      </div>
    </div>

    <!-- GitHub CTA -->
    <div class="card-earth mt-5 p-4 text-center mx-auto" style="max-width: 550px;">
      <div class="mb-3">
        <i class="bi bi-github text-white" style="font-size: 2.5rem; opacity: 0.8;"></i>
      </div>
      <h2 class="mb-2" style="color: white; font-weight: 800; letter-spacing: 0.02em;">GitHub Repository</h2>
      <p class="mx-auto mb-4" style="color: var(--earth-muted); max-width: 500px; font-size: 0.95rem; line-height: 1.5;">
        View the source code, report issues, or contribute to Earth Numerator on GitHub.
      </p>
      <div class="d-flex justify-content-center gap-3">
        <a href="https://github.com/Skyl0/earth-numerator" target="_blank" class="btn btn-earth px-4 py-2 d-inline-flex align-items-center">
          <i class="bi bi-star-fill me-2"></i> Star on GitHub
        </a>
        <a href="https://github.com/Skyl0/earth-numerator/issues" target="_blank" class="btn btn-outline-light px-4 py-2 d-inline-flex align-items-center" style="border-radius: 8px; font-weight: 700; border-width: 2px;">
          <i class="bi bi-bug-fill me-2"></i> Report Issue
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic needed on the home page
</script>
