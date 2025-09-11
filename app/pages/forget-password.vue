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

      <BaseButton label="Wyślij kod" type="submit" />
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

  try {
    const res = await $fetch<{ message: string; resetLink?: string }>(
      "http://localhost:3001/auth/forgot-password",
      {
        method: "POST",
        body: { email: state.email },
      }
    );

    toast.add({
      title: "Sukces",
      description: res.message,
      color: "success",
    });

    if (res.resetLink) {
      console.log("Reset link:", res.resetLink);
      window.location.href = res.resetLink;
    }
  } catch (err: any) {
    toast.add({
      title: "Błąd",
      description: err.data?.message || "Nie udało się wysłać kod",
      color: "error",
    });
  }
}
</script>
