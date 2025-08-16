<template>
  <div class="new-password-page">
    <h1>Ustaw nowe hasło</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="password">Nowe hasło</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Wprowadź hasłó"
        />
      </div>

      <div class="form-group">
        <label for="password">Powtórz nowe hasło</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Wprowadź hasłó"
        />
      </div>

      <router-link to="/login">
        <button>Potwierdzam</button>
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
.new-password-page {
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
