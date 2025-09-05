<template>
  <Layout>
    <BackButton to="/login" />

    <h1 class="mb-4 text-2xl font-bold">Zmień hasło</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" required name="email">
        <UInput
          v-model="state.email"
          placeholder="Wprowadź email"
          icon="i-lucide-at-sign"
          class="w-full"
        />
      </UFormField>

      <NuxtLink to="/new-password">
        <BaseButton label="Wyślij kod"/>
      </NuxtLink>
    </UForm>
  </Layout>
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
    description: "Kod został wysłany na email.",
    color: "success",
  });
}
</script>
