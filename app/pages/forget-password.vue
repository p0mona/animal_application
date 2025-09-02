<template>
  <div class="min-h-screen bg-[#77e177]">
    <div class="flex justify-center p-4">
      <div class="max-w-2xl bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          class="rounded-full hover:bg-violet-100 active:bg-violet-200 text-violet-500"
          @click="goBack"
        />

        <h1 class="mb-4 text-xl font-bold">Zmień hasło</h1>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Email" required name="email">
            <UInput
              v-model="state.email"
              placeholder="Wprowadź email"
              icon="i-lucide-at-sign"
              class="w-full"
            />
          </UFormField>

          <NuxtLink to="/new-password">
            <UButton
              type="button"
              class="bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
              >Wyślij kod</UButton
            >
          </NuxtLink>
        </UForm>
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

const goBack = () => {
  navigateTo("/login");
};
</script>
