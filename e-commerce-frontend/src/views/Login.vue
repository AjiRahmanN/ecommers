<template>
  <form class="form-container" @submit.prevent="login">
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
  errorMessage.value = '';
  try { 
    const response = await api.post('/auth/login', { email: email.value, password: password.value });
    // Save user info to localStorage or state management
    localStorage.setItem('user', JSON.stringify({ userId: response.data.userId, isAdmin: response.data.isAdmin }));
    alert('Login successful!');
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = 'Login failed: ' + error.response.data.error;
    } else {
      errorMessage.value = 'Login failed: Unknown error';
    }
  }
};
</script>

<style scoped>
.form-container {
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

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
