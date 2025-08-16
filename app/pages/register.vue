<template>
  <div class="register-page">
    <h1>Zarejestruj się</h1>
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

      <div class="form-group">
        <label for="password">Powtórz hasło</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Wprowadź hasłó"
        />
      </div>

      <button type="submit">Zaloguj się</button>
    </form>

    <p class="login-link">
      Już masz konto?
      <NuxtLink to="/login">Zalogować się</NuxtLink>
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

function handleRegister() {
  console.log("Zarejestruj się:", form);
  alert(`Użytkownik ${form.name} jest zarejestrowany!`);
}
</script>

<style scoped>
.register-page {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 90%;
  padding: 8px;
}

.login-link {
  margin-top: 10px;
}
</style>
