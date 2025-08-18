<template>
  <div class="new-password-page">
    <h1>Ustaw nowe hasło</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Nowe hasło" name="newPassword">
        <UInput v-model="state.newPassword" type="password" placeholder="Wprowadź hasło" />
        <UFormMessage />
      </UFormField>

       <UFormField label="Powtórz nowe hasło" name="confirmNewPassword">
        <UInput v-model="state.confirmNewPassword" type="password" placeholder="Wprowadź hasło" />
        <UFormMessage />
      </UFormField>
    </UForm>

    <NuxtLink to="/login">
      <UButton type="button">Potwierdzam</UButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  newPassword: v.pipe(v.string(), v.minLength(8, "Hasło musi mieć co najmniej 8 znaków")),
  confirmNewPassword: v.string()
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  newPassword: "",
  confirmNewPassword: "",
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (state.newPassword !== state.confirmNewPassword) {
    toast.add({ title: "Błąd", description: "Hasła nie są takie same", color: "error" });
    return;
  }

  toast.add({ title: "Sukces", description: "Hasło zostało zmienione.", color: "success" });
}
</script>

<style scoped>
.new-password-page {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}
</style>
