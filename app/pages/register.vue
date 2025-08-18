<template>
  <div class="register-page">
    <h1>Zarejestruj się</h1>


    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" placeholder="Wprowadź email" />
        <UFormMessage />
      </UFormField>

      <UFormField label="Hasło" name="password">
        <UInput v-model="state.password" type="password" placeholder="Wprowadź hasło" />
        <UFormMessage />
      </UFormField>

      <UFormField label="Powtórz hasło" name="confirmPassword">
        <UInput v-model="state.confirmPassword" type="password" placeholder="Powtórz hasło" />
        <UFormMessage />
      </UFormField>

      <UButton type="submit">Zarejestruj się</UButton>
    </UForm>

    <p class="login-link">
      Już masz konto? <NuxtLink to="/login">Zalogować się</NuxtLink>
>>>>>>> a7a9135 (changed forms for authorization and registration)
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
  alert(`Użytkownik ${form.name} jest zarejestrowany!`);
}
</script>

<style scoped>
.register-page {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.login-link {
  margin-top: 10px;
}
</style>

