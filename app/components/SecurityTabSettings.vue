<template>
  <UCard class="w-full">
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">
        Bezpieczeństwo
      </h2>
    </template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div class="w-full min-w-0">
        <UForm
          :schema="securitySchema"
          :state="localSecurity"
          class="space-y-4"
        >
          <UFormGroup label="Obecne hasło" name="currentPassword">
            <BaseInput
              label="Obecne hasło"
              v-model="localSecurity.currentPassword"
              type="password"
            />
          </UFormGroup>

          <UFormGroup label="Nowe hasło" name="newPassword">
            <BaseInput
              label="Nowe hasło"
              v-model="localSecurity.newPassword"
              type="password"
            />
          </UFormGroup>

          <UFormGroup
            label="Potwierdź nowe hasło"
            name="confirmPassword"
          >
            <BaseInput
              label="Potwierdź nowe hasło"
              v-model="localSecurity.confirmPassword"
              type="password"
            />
          </UFormGroup>

          <div class="flex justify-end">
            <BaseButton label="Zmień hasło" class="mt-2" />
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
import { computed } from "vue";

const props = defineProps<{
  security: {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  },
  twoFactorEnabled: boolean,
  securitySchema: any,
}>()

const emit = defineEmits<{
  (e: 'update:security', value: typeof props.security): void,
  (e: 'update:twoFactorEnabled', value: boolean): void,
}>()

// "прокси"-свойство, которое можно использовать в v-model
const localSecurity = computed({
  get: () => props.security,
  set: (val) => emit('update:security', val),
})

const localTwoFactor = computed({
  get: () => props.twoFactorEnabled,
  set: (val) => emit('update:twoFactorEnabled', val),
})
</script>