<template>
  <section class="welcome-banner">
    <h1>Welcome to Our E-Commerce Store</h1>
    <p>Find the best products at unbeatable prices.</p>
    <router-link to="/products" class="shop-now-btn">Shop Now</router-link>
  </section>
</template>

<script setup>
</script>

<style scoped>
.welcome-banner {
  text-align: center;
  padding: 4rem 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.welcome-banner h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.welcome-banner p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--color-text);
}

.shop-now-btn {
  display: inline-block;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.shop-now-btn:hover {
  background-color: hsla(160, 100%, 37%, 0.8);
}
</style>
