<template>
  <div class="login-page">
    <h1>Zaloguj się</h1>
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

      <div class="form-group">
        <label for="password">Hasło</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Wprowadź hasłó"
        />
      </div>

      <button type="submit">Zaloguj się</button>
    </form>

    <p class="register-link">
      Nie masz jeszcze konta?
      <NuxtLink to="/register">Zarejestruj się</NuxtLink>
    </p>

    <p class="forget-password-link">
      Nie pamiętasz hasło?
      <NuxtLink to="/forget-password">Zmień hasło</NuxtLink>
    </p>
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
.login-page {
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

button {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
}

.register-link {
  margin-top: 10px;
}
</style>
