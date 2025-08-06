<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header>
      <div class="logo">E-Commerce</div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/products">Products</RouterLink>
        <RouterLink to="/checkout">Cart</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>© 2024 E-Commerce. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 1rem;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text);
}

nav a {
  margin-left: 1rem;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
}

nav a.router-link-exact-active {
  color: hsla(160, 100%, 37%, 1);
  border-bottom: 2px solid hsla(160, 100%, 37%, 1);
  padding-bottom: 2px;
}

nav a:hover {
  color: hsla(160, 100%, 37%, 1);
}

main {
  flex-grow: 1;
  margin: 2rem 0;
  min-height: 70vh;
}

footer {
  text-align: center;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 0.9rem;
  flex-shrink: 0;
}
</style>
