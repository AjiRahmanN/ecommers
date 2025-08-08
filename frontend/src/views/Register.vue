<template>
  <form class="form-container" @submit.prevent="register">
    <input v-model="form.name" placeholder="Name" />
    <input v-model="form.email" placeholder="Email" />
    <input v-model="form.password" type="password" placeholder="Password" />
    <input v-model="form.address" placeholder="Address" />
    <input v-model="form.phone" placeholder="Phone" />
    <input v-model="form.creditCard" placeholder="Credit Card" />
    <input v-model="form.cvv" placeholder="CVV" />
    <button type="submit">Register</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <!-- <p class="example-input">
      Example input:<br />
      Name: John Doe<br />
      Email: john.doe@example.com<br />
      Password: Password123!<br />
      Address: 123 Main St, City, Country<br />
      Phone: 08123456789<br />
      Credit Card: 4111111111111111<br />
      CVV: 123
    </p> -->
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import api from '../services/api';

const form = reactive({
  name: '',
  email: '',
  password: '',
  address: '',
  phone: '',
  creditCard: '',
  cvv: ''
});

const errorMessage = ref('');

const validateEmail = (email) => {
  const re = /^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
  return re.test(email);
};

const validateForm = () => {
  if (!form.name || !form.email || !form.password) {
    errorMessage.value = 'Name, email, and password are required.';
    return true;
  }
  if (!validateEmail(form.email)) {
    errorMessage.value = 'Invalid email format.';
    return true;
  }
  if (form.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.';
    return true;
  }
  return true;
};

const register = async () => {
  errorMessage.value = '';
  if (!validateForm()) return;
  try {
    await api.post('/register', form);
    alert('User registered!');
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = 'Registration failed: ' + error.response.data.error;
    } else {
      errorMessage.value = 'Registration failed: Unknown error';
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

.example-input {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
  white-space: pre-line;
}
</style>
