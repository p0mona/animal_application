<template>
  <UCard class="w-full">
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">Bezpieczeństwo</h2>
    </template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div class="w-full min-w-0">
        <UForm
          :schema="securitySchema"
          :state="localSecurity"
          class="space-y-4"
          @submit="changePassword"
        >
          <UFormField label="Obecne hasło" name="currentPassword" required>
            <UInput
              v-model="localSecurity.currentPassword"
              type="password"
              class="w-full"
            />
            <UFormMessage />
          </UFormField>

          <div class="space-y-2">
            <UFormField label="Nowe hasło" name="newPassword" required>
              <UInput
                id="newPassword"
                v-model="localSecurity.newPassword"
                :color="color"
                :type="show ? 'text' : 'password'"
                :aria-invalid="score < 4"
                aria-describedby="password-strength"
                :ui="{ trailing: 'pe-1' }"
                class="w-full"
                @input="updatePasswordStrength"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="show ? 'Ukryj hasło' : 'Pokaż hasło'"
                    :aria-pressed="show"
                    aria-controls="newPassword"
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

            <ul class="space-y-2" aria-label="Password requirements">
              <li
                v-for="(req, index) in strength"
                :key="index"
                class="flex items-center gap-0.5"
                :class="req.met ? 'text-success' : 'text-muted'"
              >
                <UIcon
                  :name="
                    req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'
                  "
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

          <UFormField label="Powtórz hasło" name="confirmPassword" required>
            <UInput
              v-model="localSecurity.confirmPassword"
              type="password"
              class="w-full"
            />
            <UFormMessage />
          </UFormField>

          <div class="flex justify-end">
            <BaseButton
              label="Zmień hasło"
              class="mt-2"
              type="submit"
              :loading="isChangingPassword"
              :disabled="!isPasswordStrong"
            />
          </div>
        </UForm>
      </div>

      <div class="w-full min-w-0">
        <h3 class="text-sm font-medium mb-4">
          Uwierzytelnianie dwuskładnikowe
        </h3>
        <USwitch
          v-model="localTwoFactor"
          label="Włącz 2FA"
          class="w-full max-w-full [&_[data-state=checked]]:bg-violet-500 [&_[data-state=checked]_.bg-default]:bg-white"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "#imports";
import { z } from "zod";

const toast = useToast();
const isChangingPassword = ref(false);
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

const strength = computed(() =>
  checkStrength(localSecurity.value.newPassword || ""),
);
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

const isPasswordStrong = computed(() => {
  return score.value === 4;
});

const updatePasswordStrength = () => {
  strength.value;
  score.value;
};

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "Obecne hasło jest wymagane"),
    newPassword: z.string().min(1, "Nowe hasło jest wymagane"),
    confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data: { newPassword: any; confirmPassword: any; }) => data.newPassword === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

const props = defineProps<{
  security: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  twoFactorEnabled: boolean;
}>();

const emit = defineEmits<{
  (e: "update:security", value: typeof props.security): void;
  (e: "update:twoFactorEnabled", value: boolean): void;
}>();

const localSecurity = computed({
  get: () => props.security,
  set: (val) => emit("update:security", val),
});

const localTwoFactor = computed({
  get: () => props.twoFactorEnabled,
  set: (val) => emit("update:twoFactorEnabled", val),
});

const changePassword = async () => {
  if (!isPasswordStrong.value) {
    toast.add({
      title: "Błąd",
      description: "Hasło nie spełnia wszystkich wymagań bezpieczeństwa",
      color: "error",
    });
    return;
  }

  if (localSecurity.value.newPassword !== localSecurity.value.confirmPassword) {
    toast.add({
      title: "Błąd",
      description: "Nowe hasła nie są identyczne",
      color: "error",
    });
    return;
  }

  isChangingPassword.value = true;

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Brak tokenu autoryzacji");

    const response = await $fetch(
      "http://localhost:3001/auth/change-password",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: {
          currentPassword: localSecurity.value.currentPassword,
          newPassword: localSecurity.value.newPassword,
        },
      },
    );

    toast.add({
      title: "Sukces",
      description: "Hasło zostało zmienione",
      color: "success",
    });

    // Reset form
    localSecurity.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  } catch (error: any) {
    console.error("Error changing password:", error);

    let errorMessage = "Wystąpił błąd podczas zmiany hasła";

    if (error.data?.errors) {
      const firstError = error.data.errors[0];
      errorMessage = firstError.msg;
    } else if (error.data?.message) {
      errorMessage = error.data.message;
    }

    toast.add({
      title: "Błąd",
      description: errorMessage,
      color: "error",
    });
  } finally {
    isChangingPassword.value = false;
  }
};
</script>
