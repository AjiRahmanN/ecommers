<template>
  <div class="product-list">
    <h1>Produk Kami</h1>
    <div class="products-grid">
      <div class="product-card" v-for="product in products" :key="product._id">
        <img :src="product.image || 'https://via.placeholder.com/150'" alt="product.name" class="product-image" />
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-price">Rp{{ product.price.toLocaleString() }}</p>
        <button class="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const products = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/products')
    products.value = res.data
  } catch (error) {
    alert('Failed to load products')
  }
})
</script>

<style scoped>
.product-list {
  padding: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.product-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  background-color: var(--color-background-soft);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-image {
  max-width: 100%;
  height: 150px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: var(--color-text);
}

.product-price {
  font-weight: bold;
  color: hsla(160, 100%, 37%, 1);
  margin-bottom: 1rem;
}

.add-to-cart-btn {
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.add-to-cart-btn:hover {
  background-color: hsla(160, 100%, 37%, 0.8);
}
</style>
