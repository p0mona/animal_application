<template>
  <div class="forget-password-page">
    <h1>Zmień hasło</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" placeholder="Wprowadź email" />
        <UFormMessage />
      </UFormField>

      <NuxtLink to="/new-password">
        <UButton type="button">Wyślij kod</UButton>
      </NuxtLink>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Nieprawidłowy email")),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  email: "",
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!event.data) return;
  toast.add({
    title: "Sukces",
    description: "Formularz został wysłany.",
    color: "success",
  });
}
</script>

<style scoped>
.forget-password-page {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}
</style>
