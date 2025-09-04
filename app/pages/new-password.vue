<template>
  <Layout>
    <BackButton to="/login" />

    <h1 class="mb-5 text-2xl font-bold">Ustaw nowe hasło</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div>
        <UFormField label="Nowe hasło" name="newPassword">
          <UInput
            v-model="state.newPassword"
            placeholder="Wpisz hasło"
            :color="color"
            :type="show ? 'text' : 'password'"
            aria-describedby="password-strength"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                @click="show = !show"
              />
            </template>
          </UInput>

          <UProgress
            :color="color"
            :indicator="text"
            :model-value="score"
            :max="4"
            size="sm"
          />

          <p id="password-strength" class="text-sm font-medium mt-4 mb-2">
            {{ text }}. Musi zawierać:
          </p>

          <ul class="space-y-2" aria-label="Password requirements">
            <li
              v-for="(req, index) in strength"
              :key="index"
              class="flex items-center gap-0.5"
              :class="req.met ? 'text-success' : 'text-muted'"
            >
              <UIcon
                :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                class="size-4 shrink-0"
              />
              <span class="text-xs font-light">
                {{ req.text }}
                <span class="sr-only">
                  {{
                    req.met ? " - Requirement met" : " - Requirement not met"
                  }}
                </span>
              </span>
            </li>
          </ul>
        </UFormField>
      </div>

      <UFormField label="Powtórz nowe hasło" name="confirmNewPassword">
        <UInput
          v-model="state.confirmNewPassword"
          type="password"
          placeholder="Wprowadź hasło"
          class="w-full"
        />
        <UFormMessage />
      </UFormField>

      <NuxtLink to="/login">
        <UButton
          type="button"
          class="bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
          >Potwierdzam</UButton
        >
      </NuxtLink>
    </UForm>
  </Layout>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  newPassword: v.pipe(
    v.string(),
    v.minLength(8, "Hasło musi mieć co najmniej 8 znaków"),
  ),
  confirmNewPassword: v.string(),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  newPassword: "",
  confirmNewPassword: "",
});

const show = ref(false);
const toast = useToast();

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: "Przynajmniej 8 znaków" },
    { regex: /\d/, text: "Przynajmniej 1 cyfra" },
    { regex: /[a-z]/, text: "Przynajmniej 1 mała litera" },
    { regex: /[A-Z]/, text: "Przynajmniej 1 duża litera" },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}

const strength = computed(() => checkStrength(state.newPassword));
const score = computed(() => strength.value.filter((req) => req.met).length);
const color = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 1) return "error";
  if (score.value <= 2) return "warning";
  if (score.value === 3) return "warning";
  return "success";
});

const text = computed(() => {
  if (score.value === 0) return "Wprowadź hasło";
  if (score.value <= 2) return "Słabe hasło";
  if (score.value === 3) return "Średnie hasło";
  return "Silne hasło";
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (state.newPassword !== state.confirmNewPassword) {
    toast.add({
      title: "Błąd",
      description: "Hasła nie są takie same",
      color: "error",
    });
    return;
  }

  toast.add({
    title: "Sukces",
    description: "Hasło zostało zmienione.",
    color: "success",
  });
}
</script>
