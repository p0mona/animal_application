<template>
  <Layout>
    <h1 class="mb-5 text-2xl font-bold">Zaloguj się</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="state.email"
          placeholder="Wprowadź email"
          class="w-full"
        />
        <UFormMessage />
      </UFormField>

      <UFormField label="Hasło" name="password" required>
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Wprowadź hasło"
          class="w-full"
        />
        <UFormMessage />
      </UFormField>

      <BaseButton label="Zaloguj się" type="submit" />
    </UForm>

    <p class="mt-3">
      Nie masz jeszcze konta?
      <NuxtLink to="/register">Zarejestruj się</NuxtLink>
    </p>
    <p class="forget-password-link">
      Nie pamiętasz hasło?
      <NuxtLink to="/forget-password">Zmień hasło</NuxtLink>
    </p>
  </Layout>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import * as v from "valibot";
import { useUserStore } from "~/stores/user";
import { useNuxtApp, navigateTo } from "#app";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Nieprawidłowy email")),
  password: v.pipe(v.string()),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({ email: "", password: "" });
const userStore = useUserStore();
const nuxt = useNuxtApp();

async function onSubmit() {
  try {
    const res = (await $fetch("http://localhost:3001/auth/login", {
      method: "POST",
      body: { email: state.email, password: state.password },
    })) as { token: string; user: { userType: string; avatar?: string } };

    localStorage.setItem("token", res.token);
    userStore.setUser(res.user);

    if (nuxt.$toast) {
      (nuxt.$toast as any).success("Użytkownik został zalogowany");
    }

    navigateTo("/");
  } catch (err: any) {
    if (nuxt.$toast) {
      (nuxt.$toast as any).error(err?.data?.message || "Nie udało się zalogować");
    }
  }
}
</script>
