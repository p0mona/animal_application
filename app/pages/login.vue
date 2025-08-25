<template>
  <div class="min-h-screen bg-primary">
    <div class="flex justify-center p-4">
      <div class="max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <h1 class="mb-5 text-xl font-bold">Zaloguj się</h1>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
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

          <UButton type="submit">Zaloguj się</UButton>
        </UForm>

        <p class="mt-3">
          Nie masz jeszcze konta?
          <NuxtLink to="/register">Zarejestruj się</NuxtLink>
        </p>
        <p class="forget-password-link">
          Nie pamiętasz hasło?
          <NuxtLink to="/forget-password">Zmień hasło</NuxtLink>
        </p>
      </div>
    </div>
  </div>
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
  toast.add({
    title: "Sukces",
    description: "Formularz został wysłany.",
    color: "success",
  });
}
</script>
