<template>
  <div>
    <h1>Admin Dashboard</h1>
    <div>
      <button @click="currentTab = 'users'">Manage Users</button>
      <button @click="currentTab = 'products'">Manage Products</button>
    </div>

    <div v-if="currentTab === 'users'">
      <h2>Users</h2>
      <button @click="showUserForm = true; editUser = null">Add User</button>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Admin</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.isAdmin ? 'Yes' : 'No' }}</td>
            <td>
              <button @click="editUserData(user)">Edit</button>
              <button @click="deleteUser(user._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="showUserForm">
        <h3>{{ editUser ? 'Edit User' : 'Add User' }}</h3>
        <form @submit.prevent="submitUserForm">
          <input v-model="userForm.name" placeholder="Name" required />
          <input v-model="userForm.email" placeholder="Email" required />
          <input v-model="userForm.password" type="password" placeholder="Password" :required="!editUser" />
          <label>
            <input type="checkbox" v-model="userForm.isAdmin" />
            Admin
          </label>
          <button type="submit">Submit</button>
          <button type="button" @click="cancelUserForm">Cancel</button>
        </form>
      </div>
    </div>

    <div v-if="currentTab === 'products'">
      <h2>Products</h2>
      <button @click="showProductForm = true; editProduct = null">Add Product</button>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>
              <button @click="editProductData(product)">Edit</button>
              <button @click="deleteProduct(product._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="showProductForm">
        <h3>{{ editProduct ? 'Edit Product' : 'Add Product' }}</h3>
        <form @submit.prevent="submitProductForm">
          <input v-model="productForm.name" placeholder="Name" required />
          <input v-model.number="productForm.price" placeholder="Price" type="number" required />
          <button type="submit">Submit</button>
          <button type="button" @click="cancelProductForm">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const currentTab = ref('users')

const users = ref([])
const products = ref([])

const showUserForm = ref(false)
const editUser = ref(null)
const userForm = ref({
  name: '',
  email: '',
  password: '',
  isAdmin: false
})

const showProductForm = ref(false)
const editProduct = ref(null)
const productForm = ref({
  name: '',
  price: 0
})

const fetchUsers = async () => {
  try {
    const res = await api.get('/admin/users')
    users.value = res.data
  } catch (err) {
    alert('Failed to fetch users')
  }
}

const fetchProducts = async () => {
  try {
    const res = await api.get('/admin/products')
    products.value = res.data
  } catch (err) {
    alert('Failed to fetch products')
  }
}

const editUserData = (user) => {
  editUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    password: '',
    isAdmin: user.isAdmin
  }
  showUserForm.value = true
}

const cancelUserForm = () => {
  showUserForm.value = false
  editUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    isAdmin: false
  }
}

const submitUserForm = async () => {
  try {
    if (editUser.value) {
      // Update user
      await api.put(`/admin/users/${editUser.value._id}`, userForm.value)
      alert('User updated')
    } else {
      // Create user
      await api.post('/admin/users', userForm.value)
      alert('User created')
    }
    showUserForm.value = false
    fetchUsers()
  } catch (err) {
    alert('Failed to save user')
  }
}

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  try {
    await api.delete(`/admin/users/${id}`)
    alert('User deleted')
    fetchUsers()
  } catch (err) {
    alert('Failed to delete user')
  }
}

const editProductData = (product) => {
  editProduct.value = product
  productForm.value = {
    name: product.name,
    price: product.price
  }
  showProductForm.value = true
}

const cancelProductForm = () => {
  showProductForm.value = false
  editProduct.value = null
  productForm.value = {
    name: '',
    price: 0
  }
}

const submitProductForm = async () => {
  try {
    if (editProduct.value) {
      // Update product
      await api.put(`/admin/products/${editProduct.value._id}`, productForm.value)
      alert('Product updated')
    } else {
      // Create product
      await api.post('/admin/products', productForm.value)
      alert('Product created')
    }
    showProductForm.value = false
    fetchProducts()
  } catch (err) {
    alert('Failed to save product')
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await api.delete(`/admin/products/${id}`)
    alert('Product deleted')
    fetchProducts()
  } catch (err) {
    alert('Failed to delete product')
  }
}

onMounted(() => {
  fetchUsers()
  fetchProducts()
})
</script>
