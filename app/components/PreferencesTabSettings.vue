<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">Preferencje</h2>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UForm :state="localPreferences">
        <div class="space-y-4 space-x-4">
          <UFormGroup label="Język" name="language" class="space-y-2">
            <p class="text-sm">Język</p>
            <USelect
              v-model="localPreferences.language"
              :items="languageOptions"
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup
            label="Strefa czasowa"
            name="timezone"
            class="space-y-2"
          >
            <p class="text-sm">Strefa czasowa</p>
            <USelect
              v-model="localPreferences.timezone"
              :items="timezoneOptions"
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup label="Motyw" name="theme" class="space-y-2">
            <p class="text-sm">Motyw</p>
            <USelect
              v-model="localPreferences.theme"
              :items="themeOptions"
              class="w-full"
            />
          </UFormGroup>
        </div>

        <BaseButton label="Zapisz" class="mt-2" />
      </UForm>
    </div>
  </UCard>
</template>
<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  preferences: {
    language: string,
    timezone: string,
    theme: string,
  }
  languageOptions: { value: string; label: string }[],
  timezoneOptions: { value: string; label: string }[],
  themeOptions: { value: string; label: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:preferences', value: typeof props.preferences): void
}>()


const localPreferences = computed({
  get: () => props.preferences,
  set: (val) => emit('update:preferences', val),
})
</script>