<template>
  <Layout>
    <h1 class="mb-5 text-2xl font-bold">Zaloguj się</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="state.email"
          placeholder="Wprowadź email"
          icon="i-lucide-at-sign"
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
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Nieprawidłowy email")),
  password: v.pipe(v.string()),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  email: "",
  password: "",
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const res = (await $fetch("http://localhost:3001/auth/login", {
      method: "POST",
      body: {
        email: state.email,
        password: state.password,
      },
    })) as { message: string };

    toast.add({
      title: "Sukces",
      description: res.message || "Użytkownik został zalogowany.",
      color: "success",
    });

    navigateTo("/");
  } catch (error: any) {
    toast.add({
      title: "Błąd",
      description: error?.data?.message || "Nie udało się zalogować.",
      color: "error",
    });
  }
}
</script>
