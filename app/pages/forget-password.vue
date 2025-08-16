<template>
  <div class="forget-password-page">
    <h1>Zmień hasło</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Wprowadź email"
        />
      </div>

      <router-link to="/new-password">
        <button>Wysłij kod</button>
      </router-link>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const form = reactive({
  name: "",
  email: "",
  password: "",
});
</script>

<style scoped>
.forget-password-page {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 90%;
  padding: 8px;
}
</style>
