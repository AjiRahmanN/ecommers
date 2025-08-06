<template>
  <div class="checkout-container">
    <h2>Checkout</h2>
    <p>Silakan isi informasi pembayaran Anda.</p>
    <input v-model="cardNumber" placeholder="Nomor Kartu" />
    <input v-model="cvv" placeholder="CVV" />
    <button @click="checkout">Bayar</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'

const cardNumber = ref('')
const cvv = ref('')

const checkout = async () => {
  try {
    await api.post('/checkout', {
      cardNumber: cardNumber.value,
      cvv: cvv.value,
    })
    alert('Pembayaran berhasil!')
  } catch (err) {
    alert('Pembayaran gagal!')
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

button {
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: hsla(160, 100%, 37%, 0.8);
}

@media (max-width: 480px) {
  .checkout-container {
    padding: 0.5rem;
  }
}
</style>
