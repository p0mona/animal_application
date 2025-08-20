<template>
  <div class="flex justify-center">
    <div class="max-w-2xl mx-auto">
      <h1 class="mb-5">Zarejestruj się</h1>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 w"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email" required>
          <UInput
            v-model="state.email"
            placeholder="Wprowadź email"
            icon="i-lucide-at-sign"
          />
          <UFormMessage />
        </UFormField>

        <div class="space-y-2">
          <UFormField label="Hasło" name="password">
            <UInput
              id="password"
              v-model="state.password"
              placeholder="Hasło"
              :color="color"
              :type="show ? 'text' : 'password'"
              :aria-invalid="score < 4"
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
                  :aria-label="show ? 'Ukryj hasło' : 'Pokaż hasło'"
                  :aria-pressed="show"
                  aria-controls="password"
                  @click="show = !show"
                />
              </template>
            </UInput>
          </UFormField>

          <UProgress
            :color="color"
            :indicator="text"
            :model-value="score"
            :max="4"
            size="sm"
          />

          <p id="password-strength" class="text-sm font-medium">
            {{ text }}. Musi zawierać:
          </p>

          <ul class="space-y-1" aria-label="Password requirements">
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
        </div>

        <UFormField label="Powtórz hasło" name="confirmPassword">
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="Powtórz hasło"
          />
          <UFormMessage />
        </UFormField>

        <UCheckbox
          color="neutral"
          default-value
          required
          label="RODO"
          description="coca cola"
        />

        <UButton type="submit">Zarejestruj się</UButton>
      </UForm>

      <p class="mt-3">
        Już masz konto? <NuxtLink to="/login">Zalogować się</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Nieprawidłowy email")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Hasło musi mieć co najmniej 8 znaków"),
  ),
  confirmPassword: v.pipe(v.string()),
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

const show = ref(false);

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

const strength = computed(() => checkStrength(state.password));
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
</script>
