<template>
  <div class="register-page">
    <h1>Zarejestruj się</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email" >
        <UInput v-model="state.email" placeholder="Wprowadź email" />
        <UFormMessage />
      </UFormField>

      <UFormField label="Hasło" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Wprowadź hasło"
        />
        <UFormMessage />
      </UFormField>

      <UFormField label="Powtórz hasło" name="confirmPassword">
        <UInput
          v-model="state.confirmPassword"
          type="password"
          placeholder="Powtórz hasło"
        />
        <UFormMessage />
      </UFormField>


      <UCheckbox color="neutral" default-value required label="RODO" description="coca cola" />
      <UButton type="submit">Zarejestruj się</UButton>
    </UForm>

    <p class="login-link">
      Już masz konto? <NuxtLink to="/login">Zalogować się</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Nieprawidłowy email")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Hasło musi mieć co najmniej 8 znaków"),
  ),
  confirmPassword: v.pipe(
    v.string(),
    v.minLength(8, "Hasło musi mieć co najmniej 8 znaków"),
  ),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  email: "",
  password: "",
  confirmPassword: "",
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Sukces",
    description: "Użytkownik został zarejestrowany.",
    color: "success",
  });
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
